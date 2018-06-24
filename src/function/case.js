import { deepCopy } from '../utils/util'
import {
  createNewCase,
  isNextStep,
  newVariableDeclaration,
} from '../utils/syntaxTree'
import { traverseCaseRaw, traverseNode, validateTypes } from '../utils/traverse'
import * as t from 'babel-types'

/**
 * get traverseCase and traverseCaseRaw arguments
 * @param node
 * @param parent
 * @param varName
 */
const getCaseParams = path => {
  if (!t.isSwitchCase(path.node) || !t.isSwitchStatement(path.parent))
    throw new Error('path.node is not SwitchCase node')
    
  let varName = null
  if (path.node.consequent.length >= 2) {
    varName =
      path.node.consequent[path.node.consequent.length - 2].expression.left.name
  }
  return {
    path,
    switchCase: path.node,
    switchStatement: path.parent,
    caseLen: path.parent.cases.length,
    firstStatement: path.node.consequent[0],
    secondStatement: path.node.consequent[path.node.consequent.length - 2],
    varName,
  }
}

const getCaseNum = switchCase => switchCase.test.value
const setCaseNum = (switchCase, num) => (switchCase.test.value = num)
const getNextNum = switchCase =>
  switchCase.consequent[switchCase.consequent.length - 2].expression.right.value
const setNextNum = (switchCase, num) =>
  (switchCase.consequent[
    switchCase.consequent.length - 2
  ].expression.right.value = num)

function astMultiStatement(path) {
  let { caseLen, switchCase, switchStatement } = getCaseParams(path)

  if (switchCase.consequent.length > 3) {
    let consequentOrigin = switchCase.consequent,
      stepOrigin = switchCase.consequent[switchCase.consequent.length - 2],
      stepNum = stepOrigin.expression.right.value

    if (
      stepOrigin.type === 'ExpressionStatement' &&
      stepOrigin.expression.type === 'AssignmentExpression' &&
      stepOrigin.expression.right.type === 'NumericLiteral'
    ) {
      for (let i = 1; i <= consequentOrigin.length - 3; i++) {
        let newCase = deepCopy(switchCase),
          step = deepCopy(stepOrigin)

        setCaseNum(newCase, caseLen + i)
        step.expression.right.value =
          i < consequentOrigin.length - 3 ? newCase.test.value + 1 : stepNum

        newCase.consequent = [consequentOrigin[i], step, t.breakStatement()]
        switchStatement.cases.push(newCase)
      }
      stepOrigin.expression.right.value = caseLen + 1
      switchCase.consequent.splice(1, consequentOrigin.length - 3)
    }
  }
}

function astMultiDeclaration(path) {
  let {
    caseLen,
    switchCase,
    firstStatement,
    varName,
    switchStatement,
  } = getCaseParams(path)
  if (
    switchCase.consequent.length === 3 &&
    firstStatement.type === 'VariableDeclaration' &&
    firstStatement.declarations.length > 1
  ) {
    for (let i = 1; i < firstStatement.declarations.length; i++) {
      let newCase = createNewCase(
        varName,
        caseLen + i,
        i === firstStatement.declarations.length - 1
          ? getNextNum(switchCase)
          : caseLen + i + 1
      )
      newCase.consequent.unshift(
        newVariableDeclaration(firstStatement.declarations[i])
      )
      switchStatement.cases.push(newCase)
    }
    firstStatement.declarations.length = 1
    setNextNum(switchCase, caseLen + 1)
  }
}

function astMultiNextStep(path) {
  let { switchCase, varName } = getCaseParams(path)
  let i = switchCase.consequent.findIndex(n => isNextStep(n, varName))
  if (i < switchCase.consequent.length - 2) {
    switchCase.consequent.splice(i + 1, switchCase.consequent.length - i - 2)
  }
}

/**
 *
 * @param tree
 */
export const disorderCase = tree =>
  traverseNode(tree)(
    validateTypes(['SwitchStatement'])((node, parent) =>
      node.cases.sort((a, b) => Math.random() - 0.5)
    )
  )

/**
 * 将多行语句分解到多个case中
 * @param tree
 */
export const transformConsequent = tree => {
  let trvCase = traverseCaseRaw(tree)
  trvCase(astMultiNextStep)
  trvCase(astMultiStatement)
  trvCase(astMultiDeclaration)
}

export {
  astMultiStatement,
  astMultiDeclaration,
  astMultiNextStep,
  getCaseParams,
  getNextNum,
  setNextNum,
  getCaseNum,
  setCaseNum,
}

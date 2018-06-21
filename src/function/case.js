import { deepCopy } from '../utils/util'
import { createNewCase, isNextStep, newVariableDeclaration } from '../utils/syntaxTree'
import { traverseCaseRaw, traverseNode, validateTypes } from '../utils/traverse'

/**
 * get traverseCase and traverseCaseRaw arguments
 * @param node
 * @param parent
 * @param varName
 */
const getCaseParams = (node, parent) => ({
  switchCase: node,
  switchStatement: parent,
  caseLen: parent.cases.length,
  firstStatement: node.consequent[0],
  secondStatement: node.consequent[node.consequent.length - 2],
  varNames: [node.consequent[node.consequent.length - 2].expression.left.name],
})

const setRawAndValue = (obj, value) => {
  obj.value = value
  obj.raw = value + ''
}

const getCaseNum = switchCase => switchCase.test.value
const setCaseNum = (switchCase, num) => setRawAndValue(switchCase.test, num)
const getNextNum = switchCase =>
  switchCase.consequent[switchCase.consequent.length - 2].expression.right.value
const setNextNum = (switchCase, num) =>
  setRawAndValue(switchCase.consequent[switchCase.consequent.length - 2].expression.right, num)

function astMultiStatement({ switchCase, switchStatement, caseLen, firstStatement, varNames }) {
  if (switchCase.consequent.length > 3) {
    let consequentOrigin = switchCase.consequent,
      stepOrigin = switchCase.consequent[switchCase.consequent.length - 2],
      stepNum = stepOrigin.expression.right.value,
      breakOrigin = switchCase.consequent[switchCase.consequent.length - 1]

    if (
      stepOrigin.type === 'ExpressionStatement' &&
      stepOrigin.expression.type === 'AssignmentExpression' &&
      stepOrigin.expression.right.type === 'Literal'
    ) {
      for (let i = 1; i <= consequentOrigin.length - 3; i++) {
        let newCase = deepCopy(switchCase),
          step = deepCopy(stepOrigin)

        setCaseNum(newCase, caseLen + i)
        setRawAndValue(
          step.expression.right,
          i < consequentOrigin.length - 3 ? newCase.test.value + 1 : stepNum
        )
        newCase.consequent = [consequentOrigin[i], step, breakOrigin]
        switchStatement.cases.push(newCase)
      }
      setRawAndValue(stepOrigin.expression.right, caseLen + 1)
      switchCase.consequent.splice(1, consequentOrigin.length - 3)
    }
  }
}

function astMultiDeclaration({ switchCase, switchStatement, caseLen, firstStatement, varNames }) {
  if (
    switchCase.consequent.length === 3 &&
    firstStatement.type === 'VariableDeclaration' &&
    firstStatement.declarations.length > 1
  ) {
    for (let i = 1; i < firstStatement.declarations.length; i++) {
      let newCase = createNewCase(
        varNames[0],
        caseLen + i,
        i === firstStatement.declarations.length - 1 ? getNextNum(switchCase) : caseLen + i + 1
      )
      newCase.consequent.unshift(newVariableDeclaration(firstStatement.declarations[i]))
      switchStatement.cases.push(newCase)
    }
    firstStatement.declarations.length = 1
    setNextNum(switchCase, caseLen + 1)
  }
}

function astMultiNextStep({ switchCase, switchStatement, caseLen, firstStatement, varNames }) {
  let i = switchCase.consequent.findIndex(n => isNextStep(n, varNames[0]))
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
  setRawAndValue,
  getNextNum,
  setNextNum,
  getCaseNum,
  setCaseNum,
}

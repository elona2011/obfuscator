import * as estraverse from 'estraverse'
import { generate } from 'escodegen'
import { parseScript } from 'esprima'
import { deepCopy, getVarName } from '../utils/util'
import { CaseOptions, setNextNum, getCaseNum, getNextNum, setCaseNum } from '../function/case'
import { createNewCase } from '../utils/syntaxTree'

export function astExp({ switchCase, switchStatement, caseLen, node, varNames }) {
  if (node.left.type === 'BinaryExpression') {
    let newCase = createNewCase(varNames[0], getCaseNum(switchCase), ++caseLen)

    newCase.consequent.unshift(parseScript(`var ${varNames[1]} = ${generate(node.left)}`).body[0])
    switchStatement.cases.push(newCase)

    if (node.right.type === 'BinaryExpression') {
      let newCase = createNewCase(varNames[0], caseLen, ++caseLen)

      newCase.consequent.unshift(
        parseScript(`var ${varNames[2]} = ${generate(node.right)}`).body[0]
      )
      switchStatement.cases.push(newCase)

      node.right = { name: varNames[2], type: 'Identifier' }
    }
    setCaseNum(switchCase, caseLen)
    node.left = { name: varNames[1], type: 'Identifier' }
  } else if (node.right.type === 'BinaryExpression') {
    let newCase = createNewCase(varNames[0], getCaseNum(switchCase), ++caseLen)

    newCase.consequent.unshift(parseScript(`var ${varNames[1]} = ${generate(node.right)}`).body[0])
    switchStatement.cases.push(newCase)

    node.right = { name: varNames[1], type: 'Identifier' }
    setCaseNum(switchCase, caseLen)
  }
}

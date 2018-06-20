import * as estraverse from 'estraverse'
import { generate } from 'escodegen'
import { parseScript } from 'esprima'
import { deepCopy } from '../utils/util'
import { CaseOptions, setNextNum, getCaseNum, getNextNum } from '../function/case'
import { getBreakStatement, createNewCase } from '../utils/syntaxTree'

function astWhile({ switchCase, switchStatement, caseLen, firstStatement, varNames }) {
  let newCase1 = createNewCase(varNames[0], caseLen + 1, getCaseNum(switchCase))

  if (firstStatement.body.type === 'BlockStatement') {
    newCase1.consequent = firstStatement.body.body.concat(newCase1.consequent)
  } else {
    newCase1.consequent = [firstStatement.body].concat(newCase1.consequent)
  }
  switchStatement.cases.push(newCase1)

  //edit original case
  switchCase.consequent = [
    parseScript(
      `${varNames[0]}=${generate(firstStatement.test)}?${caseLen + 1}:${getNextNum(switchCase)}`
    ).body[0],
    getBreakStatement(),
  ]
}

function astDoWhile({
  switchCase,
  switchStatement,
  caseLen,
  firstStatement,
  secondStatement,
  varNames,
}) {
  let newCase1 = createNewCase(varNames[0], caseLen + 1, 0)

  newCase1.consequent = [
    parseScript(
      `${varNames[0]}=${generate(firstStatement.test)}?${getCaseNum(switchCase)}:${getNextNum(
        switchCase
      )}`
    ).body[0],
    getBreakStatement(),
  ]
  switchStatement.cases.push(newCase1)

  //edit original case
  if (firstStatement.body.type === 'BlockStatement') {
    switchCase.consequent = firstStatement.body.body.concat([secondStatement, getBreakStatement()])
  }
  setNextNum(switchCase, caseLen + 1)
}

export { astWhile, astDoWhile }

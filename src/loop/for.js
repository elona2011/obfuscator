import * as t from 'babel-types'
import { generate } from 'escodegen'
import { CaseOptions, setNextNum, getCaseNum, getNextNum } from '../function/case'
import { getNextStep, createNewCase } from '../utils/syntaxTree'
import { replaceNode, estrvTypeSkip, validateTypes } from '../utils/traverse'
import { parseExpression } from '@babel/parser'

export function astFor({ switchCase, switchStatement, caseLen, firstStatement, varNames }) {
  let newCase1 = createNewCase(varNames[0], caseLen + 1, 0),
    newCase2 = createNewCase(varNames[0], caseLen + 2, caseLen + 3),
    newCase3 = createNewCase(varNames[0], caseLen + 3, caseLen + 1)

  //replace break/continue
  let replaceAndSkipFor = estrvTypeSkip(firstStatement)('ForStatement')
  replaceAndSkipFor(
    validateTypes(['BreakStatement'])(() => getNextStep(varNames[0], getNextNum(switchCase)))
  )
  replaceAndSkipFor(
    validateTypes(['ContinueStatement'])(() => getNextStep(varNames[0], caseLen + 2))
  )

  //for.init
  newCase1.consequent = [
    t.expressionStatement(
      parseExpression(
        `${varNames[0]}=${generate(firstStatement.test)}?${caseLen + 2}:${getNextNum(switchCase)}`
      )
    ),
    t.breakStatement(),
  ]
  switchStatement.cases.push(newCase1)

  if (firstStatement.body.type === 'BlockStatement') {
    newCase2.consequent = firstStatement.body.body.concat(newCase2.consequent)
  } else {
    newCase2.consequent = [firstStatement.body].concat(newCase2.consequent)
  }

  switchStatement.cases.push(newCase2)
  if (firstStatement.update) {
    newCase3.consequent.unshift(t.expressionStatement(firstStatement.update))
  }
  switchStatement.cases.push(newCase3)

  //edit original case
  if (firstStatement.init && firstStatement.init.type === 'AssignmentExpression') {
    switchCase.consequent.splice(0, 1, t.expressionStatement(firstStatement.init))
  } else if (firstStatement.init) {
    switchCase.consequent.splice(0, 1, firstStatement.init)
  } else {
    switchCase.consequent.splice(0, 1)
  }
  setNextNum(switchCase, caseLen + 1)
}

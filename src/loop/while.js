import {
  setNextNum,
  getCaseNum,
  getNextNum,
  getCaseParams,
} from '../function/case'
import { createNewCase } from '../utils/syntaxTree'
import { parseExpression } from '@babel/parser'
import generate from '@babel/generator'
import * as t from 'babel-types'

function astWhile(path) {
  let {
    varName,
    caseLen,
    firstStatement,
    switchCase,
    switchStatement,
  } = getCaseParams(path)

  if (t.isWhileStatement(firstStatement)) {
    let newCase1 = createNewCase(varName, caseLen + 1, getCaseNum(switchCase))

    if (firstStatement.body.type === 'BlockStatement') {
      newCase1.consequent = firstStatement.body.body.concat(newCase1.consequent)
    } else {
      newCase1.consequent = [firstStatement.body].concat(newCase1.consequent)
    }
    switchStatement.cases.push(newCase1)

    //edit original case
    switchCase.consequent = [
      t.expressionStatement(
        parseExpression(
          `${varName}=${generate(firstStatement.test).code}?${caseLen +
            1}:${getNextNum(switchCase)}`
        )
      ),
      t.breakStatement(),
    ]
  }
}

function astDoWhile(path) {
  let {
    varName,
    caseLen,
    firstStatement,
    switchCase,
    switchStatement,
    secondStatement,
  } = getCaseParams(path)

  if (t.isDoWhileStatement(firstStatement)) {
    let newCase1 = createNewCase(varName, caseLen + 1, 0)

    newCase1.consequent = [
      t.expressionStatement(
        parseExpression(
          `${varName}=${generate(firstStatement.test).code}?${getCaseNum(
            switchCase
          )}:${getNextNum(switchCase)}`
        )
      ),
      t.breakStatement(),
    ]
    switchStatement.cases.push(newCase1)

    //edit original case
    if (firstStatement.body.type === 'BlockStatement') {
      switchCase.consequent = firstStatement.body.body.concat([
        secondStatement,
        t.breakStatement(),
      ])
    }
    setNextNum(switchCase, caseLen + 1)
  }
}

export { astWhile, astDoWhile }

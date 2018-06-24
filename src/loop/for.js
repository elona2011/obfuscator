import * as t from 'babel-types'
import {
  CaseOptions,
  setNextNum,
  getCaseNum,
  getNextNum,
  getCaseParams,
} from '../function/case'
import { getNextStep, createNewCase } from '../utils/syntaxTree'
import { parseExpression } from '@babel/parser'
import generate from '@babel/generator'

export function astFor(path) {
  let {
    varName,
    caseLen,
    firstStatement,
    switchCase,
    switchStatement,
  } = getCaseParams(path)

  if (t.isForStatement(firstStatement)) {
    let newCase1 = createNewCase(varName, caseLen + 1, 0),
      newCase2 = createNewCase(varName, caseLen + 2, caseLen + 3),
      newCase3 = createNewCase(varName, caseLen + 3, caseLen + 1)

    //replace break/continue
    path.traverse({
      ForStatement(path) {
        path.traverse({
          ForStatement(path) {
            path.skip()
          },
          BreakStatement(path) {
            path.replaceWith(getNextStep(varName, getNextNum(switchCase)))
          },
          ContinueStatement(path) {
            path.replaceWith(getNextStep(varName, caseLen + 2))
          },
        })
        path.skip()
      },
    })

    //for.init
    newCase1.consequent = [
      t.expressionStatement(
        parseExpression(
          `${varName}=${generate(firstStatement.test).code}?${caseLen +
            2}:${getNextNum(switchCase)}`
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
    if (
      firstStatement.init &&
      firstStatement.init.type === 'AssignmentExpression'
    ) {
      switchCase.consequent.splice(
        0,
        1,
        t.expressionStatement(firstStatement.init)
      )
    } else if (firstStatement.init) {
      switchCase.consequent.splice(0, 1, firstStatement.init)
    } else {
      switchCase.consequent.splice(0, 1)
    }
    setNextNum(switchCase, caseLen + 1)
  }
}

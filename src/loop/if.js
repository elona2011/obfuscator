import { parseExpression } from '@babel/parser'
import { getNextNum, getCaseParams } from '../function/case'
import { createNewCase, getNextStep } from '../utils/syntaxTree'
import * as t from 'babel-types'
import generate from '@babel/generator'

/**
 *
 * @param param0
 */
export function astIf(path) {
  let {
    caseLen,
    switchCase,
    firstStatement,
    varName,
    switchStatement,
  } = getCaseParams(path)

  if (t.isIfStatement(firstStatement)) {
    // create a new Case
    let newCase = createNewCase(varName, caseLen + 1, 0)
    if (
      firstStatement.consequent.type === 'BlockStatement' &&
      firstStatement.consequent.body
    ) {
      // block
      firstStatement.consequent.body.push(
        getNextStep(varName, getNextNum(switchCase))
      )
      firstStatement.consequent.body.push(t.breakStatement())
      newCase.consequent = firstStatement.consequent.body
    } else {
      // not block
      newCase.consequent = [
        firstStatement.consequent,
        getNextStep(varName, getNextNum(switchCase)),
        t.breakStatement(),
      ]
    }
    switchStatement.cases.push(newCase)

    if (firstStatement.alternate) {
      let c = createNewCase(varName, caseLen + 2, 0)
      if (
        firstStatement.alternate.type === 'BlockStatement' &&
        firstStatement.alternate.body
      ) {
        firstStatement.alternate.body.push(
          getNextStep(varName, getNextNum(switchCase))
        )
        firstStatement.alternate.body.push(t.breakStatement())
        c.consequent = firstStatement.alternate.body
      } else {
        c.consequent = [
          firstStatement.alternate,
          getNextStep(varName, getNextNum(switchCase)),
          t.breakStatement(),
        ]
      }
      switchStatement.cases.push(c)
    }

    // transform the original case
    let a = t.expressionStatement(
      parseExpression(
        `${varName}=${generate(firstStatement.test).code}?${caseLen + 1}:${
          firstStatement.alternate
            ? caseLen + 2
            : switchCase.consequent[switchCase.consequent.length - 2].expression
                .right.value
        }`
      )
    )
    switchCase.consequent = [
      a,
      switchCase.consequent[switchCase.consequent.length - 1],
    ]
  }
}

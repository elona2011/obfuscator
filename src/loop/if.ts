import { Node, IfStatement } from 'estree'
import { generate } from 'escodegen'
import { parseScript } from 'esprima'
import { CaseOptions, getNextNum } from '../function/case';
import { getBreakStatement, createNewCase, getNextStep } from '../utils/syntaxTree';

interface IfOptions extends CaseOptions {
  firstStatement: IfStatement
}

/**
 *
 * @param param0
 */
function astIf({
  caseLen,
  switchCase,
  firstStatement,
  varNames,
  switchStatement
}: IfOptions) {
  // create a new Case
  let newCase = createNewCase(varNames[0], caseLen + 1, 0)
  if (
    firstStatement.consequent.type === 'BlockStatement' &&
    firstStatement.consequent.body
  ) {
    // block
    firstStatement.consequent.body.push(getNextStep(varNames[0], getNextNum(switchCase)))
    firstStatement.consequent.body.push(getBreakStatement())
    newCase.consequent = firstStatement.consequent.body
  } else {
    // not block
    newCase.consequent = [
      firstStatement.consequent,
      getNextStep(varNames[0], getNextNum(switchCase)),
      getBreakStatement()
    ]
  }
  switchStatement.cases.push(newCase)

  if (firstStatement.alternate) {
    let c = createNewCase(varNames[0], caseLen + 2, 0)
    if (
      firstStatement.alternate.type === 'BlockStatement' &&
      firstStatement.alternate.body
    ) {
      firstStatement.alternate.body.push(getNextStep(varNames[0], getNextNum(switchCase)))
      firstStatement.alternate.body.push(
        getBreakStatement()
      )
      c.consequent = firstStatement.alternate.body
    } else {
      c.consequent = [
        firstStatement.alternate,
        getNextStep(varNames[0], getNextNum(switchCase)),
        getBreakStatement()
      ]
    }
    switchStatement.cases.push(c)
  }

  // transform the original case
  ; (<any>switchCase.consequent) = [
    parseScript(
      `${varNames[0]}=${generate(firstStatement.test)}?${caseLen + 1}:${
      firstStatement.alternate ? caseLen + 2 : (<any>switchCase.consequent[switchCase.consequent.length - 2]).expression.right.value
      }`
    ).body[0],
    switchCase.consequent[switchCase.consequent.length - 1]
  ]
}

export { astIf, IfOptions }

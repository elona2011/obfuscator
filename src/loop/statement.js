import { generate } from 'escodegen'
import { parseScript } from 'esprima'
import { CaseOptions, getNextNum, transformConsequent } from '../function/case'
import { getBreakStatement, createNewCase, getNextStep } from '../utils/syntaxTree'
import { astIf } from './if'
import { traverseCase, traverseCaseRaw } from '../utils/traverse'
import { astWhile, astDoWhile } from './while'
import { astFor } from './for'

/**
 *
 * @param param0
 */
function transformStatement(nodeFn) {
  while (getStatementNum(nodeFn)) {
    transformConsequent(nodeFn)

    let traverseFn = traverseCase(nodeFn)
    traverseFn('IfStatement', astIf)
    traverseFn('ForStatement', astFor)
    traverseFn('WhileStatement', astWhile)
    traverseFn('DoWhileStatement', astDoWhile)
  }
  transformConsequent(nodeFn)
}

/**
 * if或for的数量
 * @param tree
 */
function getStatementNum(tree) {
  let ifNum = 0,
    forNum = 0,
    whileNum = 0,
    dowhileNum = 0,
    totalNum = 0

  traverseCaseRaw(tree)(caseOptions => {
    for (let n of caseOptions.switchCase.consequent) {
      if (n.type === 'IfStatement') {
        ifNum++
        totalNum++
      } else if (n.type === 'ForStatement') {
        forNum++
        totalNum++
      } else if (n.type === 'WhileStatement') {
        whileNum++
        totalNum++
      } else if (n.type === 'DoWhileStatement') {
        dowhileNum++
        totalNum++
      }
    }
  })
  console.log(
    `ifNum:${ifNum},forNum:${forNum},whileNum:${whileNum},dowhileNum:${dowhileNum},total:${totalNum}`
  )
  return totalNum
}

export { transformStatement }

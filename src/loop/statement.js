import { generate } from 'escodegen'
import { parseScript } from 'esprima'
import { CaseOptions, getNextNum, transformConsequent } from '../function/case'
import {
  getBreakStatement,
  createNewCase,
  getNextStep,
} from '../utils/syntaxTree'
import { astIf } from './if'
import { traverseCase, traverseCaseRaw } from '../utils/traverse'
import { astWhile, astDoWhile } from './while'
import { astFor } from './for'
import traverse from '@babel/traverse'

/**
 *
 * @param param0
 */
function transformStatement(nodeFn) {
  while (getStatementNum(nodeFn)) {
    transformConsequent(nodeFn)

    let traverseFn = traverseCaseRaw(nodeFn)
    traverseFn('IfStatement', astIf)
    traverseCase(nodeFn, astFor)
    // traverseFn('ForStatement', astFor)
    traverseFn('WhileStatement', astWhile)
    traverseFn('DoWhileStatement', astDoWhile)
  }
  transformConsequent(nodeFn)
}

/**
 * if或for的数量
 * @param tree
 */
export function getStatementNum(path) {
  let ifNum = 0,
    forNum = 0,
    whileNum = 0,
    dowhileNum = 0,
    totalNum = 0

  path.traverse({
    Function(path) {
      path.skip()
    },
    ForStatement() {
      forNum++
      totalNum++
    },
    IfStatement() {
      ifNum++
      totalNum++
    },
    WhileStatement() {
      whileNum++
      totalNum++
    },
    DoWhileStatement() {
      dowhileNum++
      totalNum++
    },
  })

  console.log(
    `ifNum:${ifNum},forNum:${forNum},whileNum:${whileNum},dowhileNum:${dowhileNum},total:${totalNum}`
  )
  return totalNum
}

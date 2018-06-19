import { traverseNode, traverseFn, traverseCase, validateTypes } from '../utils/traverse'
import { SwitchStatement, Node, Statement, VariableDeclaration } from 'estree'
import { parseScript } from 'esprima'
import { getVarName } from '../utils/util'
import { getMemberExpression } from '../utils/syntaxTree'
import { CaseOptions } from '../function/case'
import { transformFn } from '../main'

/**
 * default value
 */
const arr = { num: 48, offset: 7, len: 3 }

/**
 * edit num
 * @param tree
 */
export function transformNum(tree: Node) {
  let maxCaseLen = 0
  traverseNode(tree)(
    validateTypes(['SwitchStatement'])((node: SwitchStatement) => {
      maxCaseLen = node.cases.length > maxCaseLen ? node.cases.length : maxCaseLen
    }),
  )

  const loopArrayVarName = getVarName(1)[0],
    arrNum = maxCaseLen + 1,
    offset = 7

  traverseFn(tree)((nodeFn, isRoot) => {
    let fnArr = nodeFn.body.body

    if (isRoot) {
      let i = (<any>fnArr[0]).directive === 'use strict' ? 1 : 0
      fnArr.splice(i, 0, <Statement>transformFn(parseScript(`var ${loopArrayVarName}=(${loopArray.toString()})(${arrNum},${offset});`).body[0]))
    }

    setArrValues(arrNum, offset, 3)
    if (!nodeFn.id || (nodeFn.id && nodeFn.id.name !== 'loopArray')) {
      //edit while init num
      let whileIndex = fnArr.findIndex(n => n.type === 'WhileStatement')
      if (whileIndex > 0) {
        let stepInitIndex = whileIndex - 1
        if (fnArr[stepInitIndex].type === 'VariableDeclaration') {
          ;(<VariableDeclaration>fnArr[stepInitIndex]).declarations[0].init = getMemberExpression(loopArrayVarName, getArrParam((<any>fnArr[stepInitIndex]).declarations[0].init.value))
        }
        ;(<any>fnArr[whileIndex]).test.right = getMemberExpression(loopArrayVarName, getArrParam((<any>fnArr[whileIndex]).test.right.value))
      }

      //edit case step num and next step num
      traverseCase(nodeFn)(null, (currentCase: CaseOptions) => {
        if (currentCase.switchCase.test && currentCase.switchCase.test.type === 'Literal') {
          currentCase.switchCase.test = getMemberExpression(loopArrayVarName, getArrParam(<number>currentCase.switchCase.test.value))
        }
        if (currentCase.secondStatement.expression.type === 'AssignmentExpression') {
          if (currentCase.secondStatement.expression.right.type === 'ConditionalExpression') {
            if (currentCase.secondStatement.expression.right.consequent.type === 'Literal') {
              currentCase.secondStatement.expression.right.consequent = getMemberExpression(loopArrayVarName, getArrParam(<number>currentCase.secondStatement.expression.right.consequent.value))
            }
            if (currentCase.secondStatement.expression.right.alternate.type === 'Literal') {
              currentCase.secondStatement.expression.right.alternate = getMemberExpression(loopArrayVarName, getArrParam(<number>currentCase.secondStatement.expression.right.alternate.value))
            }
          } else if (currentCase.secondStatement.expression.right.type === 'Literal') {
            currentCase.secondStatement.expression.right = getMemberExpression(loopArrayVarName, getArrParam(<number>currentCase.secondStatement.expression.right.value))
          }
        }
      })
    }
  })
}

export const getArrParam = (value: number) => getArrIndex(value, arr.len, arr.num, arr.offset)
export const getLoopArr = (arrNum?: number, offset?: number, len?: number) => {
  setArrValues(arrNum || 48, offset || 7, len || 3)
  return loopArray(arr.num, arr.offset)
}
const setArrValues = (arrNum: number, offset: number, len: number) => {
  arr.num = arrNum
  arr.offset = offset
  arr.len = len
}

/**
 *
 * @param arrNum
 * @param offset
 */
export function loopArray(arrNum: number, offset: number): any[] {
  let arr: any[] = [],
    i = 0,
    ii = 0

  while (i < arrNum) {
    arr[(i + offset) % arrNum] = []
    i++
  }
  while (ii < arrNum) {
    let I = arrNum - 1
    while (I >= 0) {
      arr[ii][(I + offset * ii) % arrNum] = arr[I]
      I--
    }
    ii++
  }
  return arr
}

/**
 * 随机获取一个数组参数
 * @param num
 * @param len 参数长度
 * @param arrNum
 * @param offset
 */
function getArrIndex(num: number, len: number, arrNum: number, offset: number): number[] {
  if (num >= arrNum) {
    throw `num:${num} must less than arrNum:${arrNum}!`
  }

  len = Math.floor(len)
  if (len < 1) throw `len:${len} must great than zero!`

  if (len === 1) return [num]

  let nums: number[] = []
  for (let i = 0; i < len - 1; i++) {
    nums.push(Math.floor(Math.random() * arrNum))
  }
  nums.push(
    (num +
      nums.reduce((a, b) => {
        let d = b - a * offset
        while (d < 0) {
          d += arrNum
        }
        return d
      }) *
        offset) %
      arrNum,
  )
  return nums
}

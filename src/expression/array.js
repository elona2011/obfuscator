import { getVarName } from 'yamutils'
import { getMemberExpression } from '../utils/syntaxTree'
import { transformFn } from '../main'
import traverse from '@babel/traverse'
import { parse } from '@babel/parser'
import { getCaseParams } from '../function/case'
import * as t from 'babel-types'

/**
 * default value
 */
const arr = { num: 48, offset: 7, len: 3 }

/**
 * edit num
 * @param tree
 */
export function transformNum(tree) {
  let maxCaseLen = 0

  traverse(tree, {
    SwitchStatement(path) {
      maxCaseLen = path.node.cases.length > maxCaseLen ? path.node.cases.length : maxCaseLen
    },
  })

  const loopArrayVarName = getVarName(3),
    arrNum = maxCaseLen + 1,
    offset = 7

  let isRoot = true
  traverse(tree, {
    Function(path) {
      let fnArr = path.node.body.body

      if (isRoot) {
        fnArr.unshift(
          transformFn(
            parse(`var ${loopArrayVarName}=(${loopArray.toString()})(${arrNum},${offset});`)
          ).program.body[0]
        )
        isRoot = false
      }

      setArrValues(arrNum, offset, 3)
      if (!path.node.id || (path.node.id && path.node.id.name !== 'loopArray')) {
        //edit while init num
        let whileIndex = fnArr.findIndex(n => n.type === 'WhileStatement')
        if (whileIndex > 0) {
          let stepInitIndex = whileIndex - 1
          if (fnArr[stepInitIndex].type === 'VariableDeclaration') {
            fnArr[stepInitIndex].declarations[0].init = getMemberExpression(
              loopArrayVarName,
              getArrParam(fnArr[stepInitIndex].declarations[0].init.value)
            )
          }
          fnArr[whileIndex].test.right = getMemberExpression(
            loopArrayVarName,
            getArrParam(fnArr[whileIndex].test.right.value)
          )
        }

        //edit case step num and next step num
        path.traverse({
          Function(path) {
            path.skip()
          },
          SwitchCase(path) {
            let { switchCase, secondStatement } = getCaseParams(path)
            
            if (t.isNumericLiteral(switchCase.test)) {
              switchCase.test = getMemberExpression(
                loopArrayVarName,
                getArrParam(switchCase.test.value)
              )
            }
            if (secondStatement.expression.type === 'AssignmentExpression') {
              if (secondStatement.expression.right.type === 'ConditionalExpression') {
                if (secondStatement.expression.right.consequent.type === 'NumericLiteral') {
                  secondStatement.expression.right.consequent = getMemberExpression(
                    loopArrayVarName,
                    getArrParam(secondStatement.expression.right.consequent.value)
                  )
                }
                if (secondStatement.expression.right.alternate.type === 'NumericLiteral') {
                  secondStatement.expression.right.alternate = getMemberExpression(
                    loopArrayVarName,
                    getArrParam(secondStatement.expression.right.alternate.value)
                  )
                }
              } else if (secondStatement.expression.right.type === 'NumericLiteral') {
                secondStatement.expression.right = getMemberExpression(
                  loopArrayVarName,
                  getArrParam(secondStatement.expression.right.value)
                )
              }
            }
          },
        })
      }
    },
  })
}

export const getArrParam = value => getArrIndex(value, arr.len, arr.num, arr.offset)
export const getLoopArr = (arrNum, offset, len) => {
  setArrValues(arrNum || 48, offset || 7, len || 3)
  return loopArray(arr.num, arr.offset)
}
const setArrValues = (arrNum, offset, len) => {
  arr.num = arrNum
  arr.offset = offset
  arr.len = len
}

/**
 *
 * @param arrNum
 * @param offset
 */
export function loopArray(arrNum, offset) {
  let arr = [],
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
function getArrIndex(num, len, arrNum, offset) {
  if (num >= arrNum) {
    throw `num:${num} must less than arrNum:${arrNum}!`
  }

  len = Math.floor(len)
  if (len < 1) throw `len:${len} must great than zero!`

  if (len === 1) return [num]

  let nums = []
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
      arrNum
  )
  return nums
}

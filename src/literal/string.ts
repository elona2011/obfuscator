import { Node, Literal, BinaryExpression } from 'estree'
import * as estraverse from 'estraverse'
import { generate } from 'escodegen'
import { parseScript } from 'esprima'
import { replaceNode, validateTypes, traverseNode } from '../utils/traverse'
import { hashCode } from '../utils/util'

export const astSplitString = validateTypes(['Literal'])((node: Literal): BinaryExpression | undefined => {
  if (typeof node.value === 'string' && node.value.length > 0 && node.value !== 'use strict') {
    let exp = node.value
      .split('')
      .reduce((a, b) => `${a}+window.String.fromCharCode(${b.charCodeAt(0)})`, ``)
      .slice(1)

    return (<any>parseScript(exp).body[0]).expression
  }
})

export const collectString = (tree: Node) => {
  let allString: { [i: string]: string } = {}
  traverseNode(tree)(
    validateTypes(['Literal'])((node, parent) => {
      if (typeof node.value === 'string') {
        let hash = hashCode(node.value)
        if (allString[hash] && allString[hash] !== node.value) {
          throw new Error('hash conflict')
        } else {
          allString[hash] = node.value
          if (node.value === 'freeze') {
            console.log('freeze', hash)
          }
        }
      }
    }),
  )

  let strArr: string[] = []
  for (let n of Object.values(allString)) {
    strArr.push(n)
  }
  return strArr
}

export const joinStrArr = (strArr: string[]) => {
  let maxLen = 0,
    len = 1,
    codes: string[] = []

  strArr.forEach(n => {
    if (n.length > maxLen) maxLen = n.length
  })
  len = maxLen < 10 ? 1 : maxLen < 100 ? 2 : maxLen < 1000 ? 3 : 4

  strArr.forEach(n => {
    let nLen = n.length + ''

    while (nLen.length < len) {
      nLen = '0' + nLen
    }
    codes.push(nLen)
  })

  return {
    len,
    data: strArr.join(''),
    code: codes.join(''),
  }
}

export function splitStr(data: string, code: string, len: number) {
  var r = []
  for (var i = 0, j = 0; i < code.length; i += len) {
    var dataLen = +code.substr(i, len)
    r.push(data.substr(j, dataLen))
    j += dataLen
  }
  return r
}

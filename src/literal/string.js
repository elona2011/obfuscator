import { replaceNode, validateTypes, traverseNode } from '../utils/traverse'
import { hashCode } from '../utils/util'
import traverse from '@babel/traverse'
import { parse } from '@babel/parser'
import { getVarName } from 'yamutils'
import * as t from 'babel-types'

export const astSplitString = validateTypes(['Literal'])(node => {
  if (typeof node.value === 'string' && node.value.length > 0 && node.value !== 'use strict') {
    let exp = node.value
      .split('')
      .reduce((a, b) => `${a}+window.String.fromCharCode(${b.charCodeAt(0)})`, ``)
      .slice(1)

    return parse(exp).body[0].expression
  }
})

export const astStr = tree => {
  let name1 = getVarName(3),
    name2 = getVarName(3),
    name3 = getVarName(3),
    originStr = getAllChars(tree),
    mutatedStr = originStr
      .split('')
      .sort(function() {
        return 0.5 - Math.random()
      })
      .join('')

  traverse(tree, {
    StringLiteral(path) {
      let sArr = path.node.value.split(''),
        r = ''
      for (let i = 0; i < sArr.length; i++) {
        r += mutatedStr.charAt(originStr.indexOf(sArr[i]))
      }
      path.replaceWith(t.callExpression(t.identifier(name3), [t.stringLiteral(r)]))
      path.skip()
    },
  })

  traverse(tree, {
    Function(path) {
      let fnArr = path.node.body.body
      let strFn = `
      var ${name2}=function(s){this.s=s}
      var ${name1}=(${getStr.toString()})('${mutatedStr}')('${originStr}')
      ${name2}.prototype.toString = function(){return ${name1}(this.s)}
      var ${name3}= function(s){return new ${name2}(s)}
      `
      path.node.body.body = parse(strFn).program.body.concat(fnArr)
      // fnArr.splice(0, 0, parse(strFn).program.body[0])
      path.stop()
    },
  })
}

export const getStr = mutatedCodes => {
  return originCodes => s => {
    let r = '',
      sArr = s.split('')
    for (let i = 0; i < sArr.length; i++) {
      r += originCodes.charAt(mutatedCodes.indexOf(sArr[i]))
    }
    return r
  }
}

export const getAllChars = tree => {
  let allChars = new Set(),
    str = ''

  traverse(tree, {
    StringLiteral(path) {
      path.node.value.split('').forEach(n => {
        allChars.add(n)
      })
    },
  })

  for (let s of allChars) {
    str += s
  }

  return str
  // traverseNode(tree)(
  //   validateTypes(['Literal'])((node, parent) => {
  //     if (typeof node.value === 'string') {
  //       let hash = hashCode(node.value)
  //       if (allString[hash] && allString[hash] !== node.value) {
  //         throw new Error('hash conflict')
  //       } else {
  //         allString[hash] = node.value
  //         if (node.value === 'freeze') {
  //           console.log('freeze', hash)
  //         }
  //       }
  //     }
  //   })
  // )

  // let strArr = []
  // for (let n of Object.values(allString)) {
  //   strArr.push(n)
  // }
  // return strArr
}

export const joinStrArr = strArr => {
  let maxLen = 0,
    len = 1,
    codes = []

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

export function splitStr(data, code, len) {
  var r = []
  for (var i = 0, j = 0; i < code.length; i += len) {
    var dataLen = +code.substr(i, len)
    r.push(data.substr(j, dataLen))
    j += dataLen
  }
  return r
}

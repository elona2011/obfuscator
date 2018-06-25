import { getLiteral, getCallExpression3 } from '../utils/syntaxTree'
import { validateTypes, traverseFn, replaceNode } from '../utils/traverse'
import { transformFn } from '../main'
import { parseScript } from 'esprima'
import { getVarName, hashCode } from '../utils/util'
import { collectString, joinStrArr, splitStr } from '../literal/string'
import { getProperty, wrapReturn } from '../embed/getProperty'
import { transform } from 'babel-core'
import { readFileSync } from 'fs'
import * as t from 'babel-types'

export const astComputedMember = path => {
  if (path.node.computed === false && path.node.property.type === 'Identifier') {
    path.node.computed = true
    path.node.property = t.StringLiteral(path.node.property.name)
  }
}

export const transformComputedMemberName = (getPropertyFnName, wrapReturnFnName, path) => {
  let editTree = replaceNode(tree)

  path.traverse({})
  //edit static member
  editTree(astComputedMember)

  let strArr = collectString(tree)
  let strObj = joinStrArr(strArr)

  // add fn
  traverseFn(tree)((nodeFn, isRoot) => {
    let fnArr = nodeFn.body.body

    if (isRoot) {
      let i = fnArr[0].directive === 'use strict' ? 1 : 0,
        codes = parseScript(`
        var ${getPropertyFnName} = ${getProperty.toString()};
        var ${wrapReturnFnName} = ${wrapReturn.toString()};
        var ${getPropertyFnName} = ${getPropertyFnName}(${splitStr.toString()}("${strObj.data}","${
          strObj.code
        }",${strObj.len}));
      `).body
      fnArr.splice(i, 0, transformFn(codes[0]), transformFn(codes[1]), transformFn(codes[2]))
    }
  })

  // replace obj
  replaceNode(tree)(
    validateTypes(['MemberExpression'])((node, parent) => {
      if (node.property.type === 'Literal' && typeof node.property.value === 'string') {
        if (parent) {
          if (parent.type === 'CallExpression') {
            return getCallExpression3(
              getPropertyFnName,
              wrapReturnFnName,
              true,
              node.object,
              getLiteral(hashCode(node.property.value) + '')
            )
          } else if (parent.type !== 'AssignmentExpression') {
            return getCallExpression3(
              getPropertyFnName,
              wrapReturnFnName,
              false,
              node.object,
              getLiteral(hashCode(node.property.value) + '')
            )
          }
        }
      }
    })
  )
}

// export const transformComputedMember = transformComputedMemberName(getVarName(1))(getVarName(1))

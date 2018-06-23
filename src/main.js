import * as estraverse from 'estraverse'
import { transformOptions, transformOptionsDefault } from '.'
import { traverseFn, traverseCase, replaceNode, traverseNode } from './utils/traverse'
import { getVarName } from './utils/util'
import { astFn } from './function/fn'
import { transformStatement } from './loop/statement'
import { CaseOptions, disorderCase } from './function/case'
import { astExp } from './expression/expression'
import { astWindow } from './literal/global'
import { astSplitString, collectString } from './literal/string'
import { astComputedMember, transformComputedMember } from './expression/member'
import { transformNum } from './expression/array'
import * as t from 'babel-types'
import traverse from '@babel/traverse'

/**
 *
 * @param tree
 */
export function transformFn(tree, options = transformOptionsDefault) {
  let isRootFn = true

  traverse(tree, {
    enter(path) {
      if (t.isFunctionDeclaration(path.node) || t.isFunctionExpression(path.node)) {
        let names = getVarName(1),
          editFn = replaceNode(path.node)

        //edit function
        astFn(path, names)

        //edit if/for/while/dowhile
        transformStatement(path)

        //edit window
        editFn(astWindow)

        //edit string
        options.splitString && editFn(astSplitString)

        //edit binary expression
        // let isAstExpEdited = true
        // while (isAstExpEdited) {
        //   isAstExpEdited = false
        //   traverseCase(path.node)(null, (currentCase: CaseOptions) => {
        //     traverseNode(currentCase.firstStatement)((node, parent) => {
        //       if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
        //         return estraverse.VisitorOption.Skip
        //       } else if (node.type === 'BinaryExpression' && (node.left.type === 'BinaryExpression' || node.right.type === 'BinaryExpression')) {
        //         astExp({
        //           ...currentCase,
        //           node,
        //           varNames: names.concat(getVarName(2)),
        //         })
        //         isAstExpEdited = true
        //         return estraverse.VisitorOption.Break
        //       }
        //     })
        //   })
        // }

        options.disorderCase && disorderCase(path.node)
        isRootFn = false
      }
    },
  })

  return tree
}

export const afterFn = (tree, options = transformOptionsDefault) => {
  transformComputedMember(tree)

  options.numberToArray && transformNum(tree)
}

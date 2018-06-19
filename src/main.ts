import { Node } from 'estree'
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

/**
 *
 * @param tree
 */
export function transformFn(tree: Node, options: transformOptions = transformOptionsDefault) {
  traverseFn(tree)((nodeFn, isRoot) => {
    let names = getVarName(1),
      editFn = replaceNode(nodeFn)

    //edit function
    astFn({ node: nodeFn, names, isRoot })

    //edit if/for/while/dowhile
    transformStatement(nodeFn)

    //edit window
    editFn(astWindow)

    //edit string
    options.splitString && editFn(astSplitString)

    //edit binary expression
    // let isAstExpEdited = true
    // while (isAstExpEdited) {
    //   isAstExpEdited = false
    //   traverseCase(nodeFn)(null, (currentCase: CaseOptions) => {
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

    options.disorderCase && disorderCase(nodeFn)
  })
  return tree
}

export const afterFn = (tree: Node, options: transformOptions = transformOptionsDefault) => {
  transformComputedMember(tree)

  options.numberToArray && transformNum(tree)
}

import { transformOptions, transformOptionsDefault } from '.'
import {
  traverseFn,
  traverseCase,
  replaceNode,
  traverseNode,
} from './utils/traverse'
import { getVarName } from './utils/util'
import { astFn } from './function/fn'
import { transformStatement, getStatementNum } from './loop/statement'
import {
  CaseOptions,
  disorderCase,
  astMultiNextStep,
  astMultiStatement,
  astMultiDeclaration,
} from './function/case'
import { astExp } from './expression/expression'
import { astWindow } from './literal/global'
import { astSplitString, collectString } from './literal/string'
import { astComputedMember, transformComputedMember } from './expression/member'
import { transformNum } from './expression/array'
import * as t from 'babel-types'
import traverse from '@babel/traverse'
import { astIf } from './loop/if'
import { astFor } from './loop/for'
import { astDoWhile, astWhile } from './loop/while'

/**
 *
 * @param tree
 */
export function transformFn(tree, options = transformOptionsDefault) {
  traverse(tree, {
    Function(path) {
      //edit function
      let msg = astFn(path)

      // if (msg !== `no while-switch-case`) {
      //   let i = 10
      //   while (i--) {
      //   // while (getStatementNum(path)) {
      //     path.traverse({

      //     })
      //   }
      // }
    },
    // Identifier(path) {
    //   astWindow(path)
    // },
    enter(path) {
      if (
        t.isFunctionDeclaration(path.node) ||
        t.isFunctionExpression(path.node)
      ) {
        // let names = getVarName(1),
        // editFn = replaceNode(path.node)
        //edit if/for/while/dowhile
        // transformStatement(path)
        //edit window
        // editFn(astWindow)
        //edit string
        // options.splitString && editFn(astSplitString)
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
        // options.disorderCase && disorderCase(path.node)
        // isRootFn = false
      }
    },
  })
  traverse(tree, {
    Function(path) {
      if (path.node.isASTEdited) {
        let repeat = 0,
          lastTotal = 0
        while (true) {
          let total = getStatementNum(path)
          if (!total) break
          if (total === lastTotal) {
            repeat++
            if (repeat >= 7) {
              break
            }
          } else {
            lastTotal = total
            repeat = 0
          }

          path.traverse({
            Function(path) {
              path.skip()
            },
            SwitchCase(path) {
              astMultiNextStep(path)
              astMultiStatement(path)
              astMultiDeclaration(path)
              astIf(path)
              astFor(path)
              astWhile(path)
              astDoWhile(path)
            },
          })
        }
      }
    },
  })
  return tree
}

export const afterFn = (tree, options = transformOptionsDefault) => {
  transformComputedMember(tree)

  options.numberToArray && transformNum(tree)
}

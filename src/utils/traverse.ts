import { Node, BlockStatement, Statement, SwitchCase, SwitchStatement, BreakStatement, ExpressionStatement, FunctionDeclaration, FunctionExpression } from 'estree'
import * as estraverse from 'estraverse'
import { CaseOptions, getCaseParams } from '../function/case'

export type cbFn = (node: any, parent: Node | null) => any

/**
 * formatted case handler
 * @param tree
 * @param cb
 */
export const traverseCase = (tree: Node) => (typeName: string | null, cb: Function) =>
  traverseCaseRaw(tree)((caseOptions: CaseOptions) => {
    if (
      (caseOptions.switchCase.consequent.length === 3 || caseOptions.switchCase.consequent.length === 2) &&
      caseOptions.secondStatement.type === 'ExpressionStatement' &&
      (caseOptions.firstStatement.type === typeName || typeName === null)
    ) {
      cb(caseOptions)
    }
  })

/**
 * unformatted case handler
 * @param tree
 * @param cb
 */
export const traverseCaseRaw = (tree: Node) => (cb: Function) => {
  let level = 0
  estraverse.traverse(tree, {
    enter(node, parent) {
      if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
        level++
        if (level > 1) {
          return estraverse.VisitorOption.Skip
        }
      } else if (parent && parent.type === 'SwitchStatement' && node.type === 'SwitchCase') {
        cb(getCaseParams(node, parent))
      }
    },
    leave(node, parent) {
      if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
        level--
      }
    },
  })
}

export const traverseFn = (tree: Node) => (cb: (fn: FunctionDeclaration | FunctionExpression, isRoot: boolean) => void) => {
  let isRootFn = true
  estrv('traverse')(tree)(
    validateTypes(['FunctionDeclaration', 'FunctionExpression'])((node, parent) => {
      cb(node, isRootFn)
      isRootFn = false
    }),
  )
}

export const traverseNode = (tree: Node) => (cb: cbFn) => estrv('traverse')(tree)(cb)
export const replaceNode = (tree: Node) => (cb: cbFn) => estrv('replace')(tree)(cb)

export const traverseNodeSkip = (tree: Node) => (skipNodeType: string) => (cb: cbFn) => estrvTypeSkip('traverse')(tree)(skipNodeType)(cb)
export const replaceNodeSkip = (tree: Node) => (skipNodeType: string) => (cb: cbFn) => estrvTypeSkip('replace')(tree)(skipNodeType)(cb)

const estrvTypeSkip = (fnType: 'replace' | 'traverse') => (tree: Node) => (skipNodeType: string) => (cb: cbFn) => {
  let nodeNum = 0

  estrv(fnType)(tree)((node, parent) => {
    if (node.type === skipNodeType) {
      nodeNum++
      if (nodeNum > 1) {
        return estraverse.VisitorOption.Skip
      }
    } else {
      return cb(node, parent)
    }
  })
}

export const validateTypes = (nodeTypes: string[]) => (cb: cbFn) => (node: any, parent: Node | null) => {
  if (nodeTypes.find(n => n === node.type)) return cb(node, parent)
}
const estrv = (fnType: 'replace' | 'traverse') => (tree: Node) => (enter: cbFn) => estraverse[fnType](tree, { enter })

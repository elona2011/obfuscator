import * as estraverse from 'estraverse'
import { CaseOptions, getCaseParams } from '../function/case'

/**
 * formatted case handler
 * @param tree
 * @param cb
 */
export const traverseCase = tree => (typeName, cb) =>
  traverseCaseRaw(tree)(caseOptions => {
    if (
      (caseOptions.switchCase.consequent.length === 3 ||
        caseOptions.switchCase.consequent.length === 2) &&
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
export const traverseCaseRaw = tree => cb => {
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

export const traverseFn = tree => cb => {
  let isRootFn = true
  estrv('traverse')(tree)(
    validateTypes(['FunctionDeclaration', 'FunctionExpression'])((node, parent) => {
      cb(node, isRootFn)
      isRootFn = false
    })
  )
}

export const traverseNode = tree => cb => estrv('traverse')(tree)(cb)
export const replaceNode = tree => cb => estrv('replace')(tree)(cb)

export const traverseNodeSkip = tree => skipNodeType => cb =>
  estrvTypeSkip('traverse')(tree)(skipNodeType)(cb)
export const replaceNodeSkip = tree => skipNodeType => cb =>
  estrvTypeSkip('replace')(tree)(skipNodeType)(cb)

const estrvTypeSkip = fnType => tree => skipNodeType => cb => {
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

export const validateTypes = nodeTypes => cb => (node, parent) => {
  if (nodeTypes.find(n => n === node.type)) return cb(node, parent)
}
const estrv = fnType => tree => enter => estraverse[fnType](tree, { enter })
import * as estraverse from 'estraverse'
import { CaseOptions, getCaseParams } from '../function/case'
import traverse from '@babel/traverse'
import * as t from 'babel-types'

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
  traverse(tree, {
    enter(path) {
      if (path.node.type === 'FunctionDeclaration' || path.node.type === 'FunctionExpression') {
        level++
        if (level > 1) {
          path.skip()
        }
      } else if (
        path.parent &&
        path.parent.type === 'SwitchStatement' &&
        path.node.type === 'SwitchCase'
      ) {
        cb(path)
      }
    },
    leave(path) {
      if (path.node.type === 'FunctionDeclaration' || path.node.type === 'FunctionExpression') {
        level--
      }
    },
  })
}

export const traverseFn = tree => cb => {
  let isRootFn = true

  traverse(tree, {
    enter(path) {
      if (t.isFunctionDeclaration(path.node) || t.isFunctionExpression(path.node)) {
        cb(path)
        isRootFn = false
      }
    },
  })
}

// export const traverseNode = tree => cb => estrv('traverse')(tree)(cb)
// export const replaceNode = tree => cb => estrv('replace')(tree)(cb)

export const estrvTypeSkip = (tree, skipNodeType, cb) => {
  let nodeNum = 0

  traverse(tree, {
    enter(path) {
      if (path.node.type === skipNodeType) {
        nodeNum++
        if (nodeNum > 1) {
          return estraverse.VisitorOption.Skip
        }
      } else {
        return cb(path.node, path.parent)
      }
    },
  })
}

export const validateTypes = nodeTypes => cb => path => {
  if (nodeTypes.find(n => n === path.node.type)) return cb(path)
}

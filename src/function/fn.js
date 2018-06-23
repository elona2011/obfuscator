import * as estraverse from 'estraverse'
import { parseScript } from 'esprima'
import { CaseOptions } from './case'
import { traverseCaseRaw } from '../utils/traverse'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from 'babel-types'

/**
 * 将fn转化为while-switch-case形式
 * @param tree
 */
export function astFn(path, names) {
  debugger
  let useStrict =
      path.node.body &&
      path.node.body.body &&
      path.node.body.body[0] &&
      path.node.body.body[0].directive === 'use strict'
        ? `'use strict'`
        : ``,
    codeStr = `function a(){
      ${useStrict}
      var ${names[0]}=1;
      while(${names[0]}!==0){
        switch(${names[0]}){
          case 1:
            ${names[0]}=0;
            break;
        }
      }
    }`

  let newTree = parse(codeStr)
  traverse(newTree, {
    SwitchCase(newPath) {
      if (useStrict) {
        path.node.body.body.shift()
      }
      newPath.node.consequent = path.node.body.body.concat(newPath.node.consequent)
    },
  })

  path.node.body = newTree.program.body[0].body
  // delEmptyStatement(newTree)
}

function delEmptyStatement(node) {
  estraverse.replace(node, {
    enter(node, parent) {
      if (node.type === 'EmptyStatement') {
        return estraverse.VisitorOption.Remove
      }
    },
  })
}

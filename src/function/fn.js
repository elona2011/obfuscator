import * as estraverse from 'estraverse'
import { parseScript } from 'esprima'
import { CaseOptions } from './case'
import { traverseCaseRaw } from '../utils/traverse'

/**
 * 将fn转化为while-switch-case形式
 * @param tree
 */
export function astFn({ node, names, isRoot }) {
  let codeArr = [],
    codeIndex = 1,
    fnBody = ``,
    useStrict =
      node.body &&
      node.body.body &&
      node.body.body[0] &&
      node.body.body[0].directive === 'use strict'
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

  let newTree = parseScript(codeStr)
  traverseCaseRaw(newTree)(({ switchCase }) => {
    if (useStrict) {
      node.body.body.shift()
    }
    switchCase.consequent = node.body.body.concat(switchCase.consequent)
  })
  node.body = newTree.body[0].body
  delEmptyStatement(newTree)
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

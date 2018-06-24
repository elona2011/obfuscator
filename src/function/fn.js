import * as estraverse from 'estraverse'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from 'babel-types'
import { getVarName } from 'yamutils'

/**
 * 将fn转化为while-switch-case形式
 * @param tree
 */
export function astFn(path, name) {
  let useStrict = '',
    varName = name || getVarName(5)

  //skip function
  if (path.node.body.body.length) {
    let leadingComments = path.node.body.body[0].leadingComments
    if (leadingComments && leadingComments.length) {
      if (leadingComments[0].value === 'no ast edit') {
        return 'no while-switch-case'
      }
    }
  }

  //edit function
  if (!path.node.isASTEdited) {
    path.traverse({
      Function(path) {
        path.stop()
      },
      Directive(path) {
        if (path.node.value.value === 'use strict')
          useStrict = `
          'use strict'`
      },
    })

    let codeStr = `function a(){
          ${useStrict}
          var ${varName}=1;
          while(${varName}!==0){
            switch(${varName}){
              case 1:
                ${varName}=0;
                break;
            }
          }
        }`

    let newTree = parse(codeStr)
    traverse(newTree, {
      SwitchCase(newPath) {
        newPath.node.consequent = path.node.body.body.concat(
          newPath.node.consequent
        )
      },
    })

    path.node.body = newTree.program.body[0].body
    path.node.isASTEdited = true
    // delEmptyStatement(newTree)
  }
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

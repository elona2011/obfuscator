import { Node, Literal, Identifier } from 'estree'
import * as estraverse from 'estraverse'
import { generate } from 'escodegen'
import { parseScript } from 'esprima'
import { replaceNode, validateTypes } from '../utils/traverse'

export const astWindow = validateTypes(['Identifier'])((node: Identifier) => {
  if (node.name === 'window') {
    return (<any>parseScript(`(1,eval)('this');`).body[0]).expression
  }
})

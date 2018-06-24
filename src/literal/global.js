import { parseExpression } from '@babel/parser'

export const astWindow = path => {
  if (path.node.name === 'window') {
    path.replaceWith(parseExpression(`(1,eval)('this')`))
  }
}

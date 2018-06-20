import { expect } from 'chai'
import { parseScript } from 'esprima'
import { astWindow } from '../src/literal/global'
import { replaceNode } from '../src/utils/traverse'

describe('global', () => {
  it('window', () => {
    let names = ['a'],
      before = `
      switch(${names[0]}){
        case 1:
          console.log(window)
          ${names[0]} = 0
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 1:
          console.log((1,eval)('this'))
          ${names[0]} = 0
          break
      }
    `
    let tree = parseScript(before),
      switchStatement = tree.body[0],
      switchCase = switchStatement.cases[0]

    replaceNode(switchCase)(astWindow)
    expect(tree).to.eql(parseScript(after))
  })
})

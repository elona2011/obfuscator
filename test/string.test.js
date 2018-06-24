import { expect } from 'chai'
import { parseScript } from 'esprima'
import { astSplitString } from '../src/literal/string'
import { replaceNode } from '../src/utils/traverse'

describe('string', () => {
  it('argument', () => {
    let names = ['a'],
      before = `
      switch(${names[0]}){
        case 1:
          console.log('abcd')
          ${names[0]} = 0
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 1:
          console.log(window.String.fromCharCode(97)+window.String.fromCharCode(98)+window.String.fromCharCode(99)+window.String.fromCharCode(100))
          ${names[0]} = 0
          break
      }
    `
    let tree = parseScript(before),
      switchStatement = tree.body[0],
      switchCase = switchStatement.cases[0]

    replaceNode(switchCase)(astSplitString)
    expect(tree).to.eql(parseScript(after))
  })

  it('assignment', () => {
    let names = ['a'],
      before = `
      switch(${names[0]}){
        case 1:
          var d = 'bcdf'
          ${names[0]} = 0
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 1:
          var d = window.String.fromCharCode(98)+window.String.fromCharCode(99)+window.String.fromCharCode(100)+window.String.fromCharCode(102)
          ${names[0]} = 0
          break
      }
    `
    let tree = parseScript(before),
      switchStatement = tree.body[0],
      switchCase = switchStatement.cases[0]

    replaceNode(switchCase)(astSplitString)
    expect(tree).to.eql(parseScript(after))
  })
})

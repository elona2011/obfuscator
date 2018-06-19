import { expect } from 'chai'
import { astIf, IfOptions } from '../src/loop/if'
import { parseScript } from 'esprima'
import { SwitchStatement, IfStatement } from 'estree'
import { getCaseParams } from '../src/function/case'
import { astSplitString } from '../src/literal/string'
import { traverseNode, replaceNode } from '../src/utils/traverse'

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
      switchStatement = <SwitchStatement>tree.body[0],
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
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    replaceNode(switchCase)(astSplitString)
    expect(tree).to.eql(parseScript(after))
  })
})

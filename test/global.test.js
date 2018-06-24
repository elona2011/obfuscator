import { astWindow } from '../src/literal/global'
import chai from 'chai'
import { parse } from '@babel/parser'
import generate from '@babel/generator'
const chaiExclude = require('chai-exclude')
import traverse from '@babel/traverse'
import * as t from 'babel-types'
let expect = chai.expect,
  excludeStrArr = [
    'column',
    'line',
    'end',
    'start',
    'loc',
    'extra',
    'comments',
    'innerComments',
    'leadingComments',
    'trailingComments',
  ]
chai.use(chaiExclude)
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
    let tree = parse(before)
    traverse(tree, {
      Identifier(path) {
        astWindow(path)
      },
    })
    let bf = generate(tree, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(tree)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })
})

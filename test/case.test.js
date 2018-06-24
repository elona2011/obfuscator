import {
  astMultiStatement,
  astMultiDeclaration,
  astMultiNextStep,
  getCaseParams,
} from '../src/function/case'
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

describe('getCaseParams', () => {
  it('throw Error when no SwitchCase', () => {
    let code = `
      var a = 1
    `
    let tree = parse(code)
    traverse(tree, {
      VariableDeclarator(path) {
        expect(() => getCaseParams(path)).to.throw()
      },
    })
  })
})

describe('case', () => {
  it('base', () => {
    let varName = ['d'],
      before = `
      switch(${varName}){
        case 1:
          a+=1
          b+=2
          c+=3
          ${varName} = 2
          break

        case 2:
          d+=4
          ${varName} = 0
          break
      }
    `,
      after = `
      switch(${varName}){
        case 1:
          a+=1
          ${varName} = 3
          break

        case 2:
          d+=4
          ${varName} = 0
          break
        
        case 3:
          b+=2
          ${varName} = 4
          break

        case 4:
          c+=3
          ${varName} = 2
          break
      }
    `
    let tree = parse(before)
    traverse(tree, {
      SwitchCase(path) {
        astMultiStatement(path)
      },
    })
    let bf = generate(tree, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(tree)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })

  it('multi declarations', () => {
    let varName = ['d'],
      before = `
      switch(${varName}){
        case 1:
          var a=1,b=2,c=3
          ${varName} = 2
          break

        case 2:
          d+=4
          ${varName} = 0
          break
      }
    `,
      after = `
      switch(${varName}){
        case 1:
          var a=1
          ${varName} = 3
          break

        case 2:
          d+=4
          ${varName} = 0
          break
        
        case 3:
          var b=2
          ${varName} = 4
          break

        case 4:
          var c=3
          ${varName} = 2
          break
      }
    `
    let tree = parse(before)
    traverse(tree, {
      SwitchCase(path) {
        astMultiDeclaration(path)
      },
    })
    let bf = generate(tree, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(tree)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })

  it('base', () => {
    let varName = ['d'],
      before = `
      switch(${varName}){
        case 1:
          var hash = 0,
          i,
          chr
          hash+=1
          ${varName} = 2
          break

        case 2:
          d+=4
          ${varName} = 0
          break
      }
    `,
      after = `
      switch(${varName}){
        case 1:
          var hash = 0,
          i,
          chr
          ${varName} = 3
          break

        case 2:
          d+=4
          ${varName} = 0
          break
        
        case 3:
          hash+=1
          ${varName} = 2
          break
      }
    `
    let tree = parse(before)
    traverse(tree, {
      SwitchCase(path) {
        astMultiStatement(path)
      },
    })
    let bf = generate(tree, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(tree)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })

  it('multi nextStep', () => {
    let varName = ['d'],
      before = `
      switch(${varName}){
        case 1:
          hash+=1
          ${varName} = 2
          ${varName} = 0
          ${varName} = 1
          break

        case 2:
          d+=4
          ${varName} = 0
          break
      }
    `,
      after = `
      switch(${varName}){
        case 1:
          hash+=1
          ${varName} = 2
          break

        case 2:
          d+=4
          ${varName} = 0
          break
      }
    `
    let tree = parse(before)
    traverse(tree, {
      SwitchCase(path) {
        astMultiNextStep(path)
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

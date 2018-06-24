import chai from 'chai'
import { astFn } from '../src/function/fn'
import traverse from '@babel/traverse'
import { parse } from '@babel/parser'
import generate from '@babel/generator'

const chaiExclude = require('chai-exclude')

let expect = chai.expect,
  excludeStrArr = ['column', 'line', 'end', 'start', 'loc', 'extra']
chai.use(chaiExclude)

describe('fn', () => {
  it('base function', () => {
    let varName = 'd',
      before = `
      function ab(){
        a+=1
        b+=2
        c+=3
      }
    `,
      after = `
      function ab(){
        var ${varName}=1
        while(${varName}!==0){
          switch(${varName}){
            case 1:
              a+=1
              b+=2
              c+=3
              ${varName} = 0
              break
          }
        }
      }
    `

    let b = parse(before),
      a = parse(after)

    a.program.body[0].isASTEdited = true
    traverse(b, {
      Function(path) {
        astFn(path, varName)
      },
    })
    let bf = generate(b, {})
    let af = generate(a, {})

    expect(bf.code).to.equal(af.code)
    expect(b)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(a)
  })

  it('use strict', () => {
    let names = ['d'],
      before = `
      function ab(){
        'use strict'
        b+=2
        c+=3
      }
    `,
      after = `
      function ab(){
        'use strict'
        var ${names[0]}=1
        while(${names[0]}!==0){
          switch(${names[0]}){
            case 1:
              b+=2
              c+=3
              ${names[0]} = 0
              break
          }
        }
      }
    `
    let b = parse(before),
      a = parse(after)

    a.program.body[0].isASTEdited = true
    traverse(b, {
      Function(path) {
        astFn(path, names[0])
      },
    })
    let bf = generate(b, {})
    let af = generate(a, {})

    expect(bf.code).to.equal(af.code)
    expect(b)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(a)
  })

  it('no ast edit', () => {
    let names = ['d'],
      before = `
      function ab(){
        //no ast edit
        b+=2
        c+=3
      }
    `,
      after = `
      function ab(){
        //no ast edit
        b+=2
        c+=3
      }
    `
    let b = parse(before),
      a = parse(after)

    traverse(b, {
      Function(path) {
        astFn(path, names[0])
      },
    })
    let bf = generate(b, {})
    let af = generate(a, {})

    expect(bf.code).to.equal(af.code)
    expect(b)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(a)
  })

  it('isASTEdited', () => {
    let names = ['d'],
      before = `
      function ab(){
        b+=2
        c+=3
      }
    `,
      after = `
      function ab(){
        b+=2
        c+=3
      }
    `
    let b = parse(before),
      a = parse(after)

    a.program.body[0].isASTEdited = true
    b.program.body[0].isASTEdited = true
    traverse(b, {
      Function(path) {
        astFn(path, names[0])
      },
    })
    let bf = generate(b, {})
    let af = generate(a, {})

    expect(bf.code).to.equal(af.code)
    expect(b)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(a)
  })
})

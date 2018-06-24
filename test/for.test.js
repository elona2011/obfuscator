import { astFor } from '../src/loop/for'
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

describe('for', () => {
  it('base', () => {
    let varName = ['ab'],
      before = `
      switch(${varName}){
        case 1:
          for(let i=0;i<5;i++){
            a+=1
            b+=2
          }
          ${varName} = 2
          break

        case 2:
          b+=3
          ${varName} = 0
          break
      }
    `,
      after = `
      switch(${varName}){
        case 1:
          let i=0
          ${varName} = 3
          break
        
        case 2:
          b+=3
          ${varName} = 0
          break

        case 3:
          ${varName} = i<5?4:2
          break
        
        case 4:
          a+=1
          b+=2
          ${varName} = 5
          break
        
        case 5:
          i++
          ${varName} = 3
          break
      }
    `

    let tree = parse(before)
    traverse(tree, {
      SwitchCase(path) {
        astFor(path)
      },
    })
    let bf = generate(tree, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(tree)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })

  it('break', () => {
    let varName = ['ab'],
      before = `
      switch(${varName}){
        case 1:
          for(let i=0;i<5;i++){
            if(a){
              b+=1
              break
            }
          }
          ${varName} = 2
          break

        case 2:
          b+=3
          ${varName} = 0
          break
      }
    `,
      after = `
      switch(${varName}){
        case 1:
          let i=0
          ${varName} = 3
          break
        
        case 2:
          b+=3
          ${varName} = 0
          break

        case 3:
          ${varName} = i<5?4:2
          break
        
        case 4:
          if(a){
            b+=1
            ${varName} = 2
          }
          ${varName} = 5
          break
        
        case 5:
          i++
          ${varName} = 3
          break
      }
    `
    let tree = parse(before)
    traverse(tree, {
      SwitchCase(path) {
        astFor(path)
      },
    })
    let bf = generate(tree, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(tree)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })

  it('embedded for', () => {
    let varName = ['ab'],
      before = `
      switch(${varName}){
        case 1:
          for(let i=0;i<5;i++){
            for(let j=0;j<3;j++){
              if(a){
                b+=1
                continue 
              }
            }
          }
          ${varName} = 2
          break

        case 2:
          b+=3
          ${varName} = 0
          break
      }
    `,
      after = `
      switch(${varName}){
        case 1:
          let i=0
          ${varName} = 3
          break
        
        case 2:
          b+=3
          ${varName} = 0
          break

        case 3:
          ${varName} = i<5?4:2
          break
        
        case 4:
          for(let j=0;j<3;j++){
            if(a){
              b+=1
              continue
            }
          }
          ${varName} = 5
          break
        
        case 5:
          i++
          ${varName} = 3
          break
      }
    `
    let tree = parse(before)
    traverse(tree, {
      SwitchCase(path) {
        debugger
        astFor(path)
      },
    })
    let bf = generate(tree, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(tree)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })

  it('continue', () => {
    let varName = ['ab'],
      before = `
      switch(${varName}){
        case 1:
          for(let i=0;i<5;i++){
            if(a){
              b+=1
              continue
            }
          }
          ${varName} = 2
          break

        case 2:
          b+=3
          ${varName} = 0
          break
      }
    `,
      after = `
      switch(${varName}){
        case 1:
          let i=0
          ${varName} = 3
          break
        
        case 2:
          b+=3
          ${varName} = 0
          break

        case 3:
          ${varName} = i<5?4:2
          break
        
        case 4:
          if(a){
            b+=1
            ${varName} = 4
          }
          ${varName} = 5
          break
        
        case 5:
          i++
          ${varName} = 3
          break
      }
    `
    let tree = parse(before)
    traverse(tree, {
      SwitchCase(path) {
        astFor(path)
      },
    })
    let bf = generate(tree, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(tree)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })

  it('without block', () => {
    let varName = ['ad'],
      before = `
      switch(${varName}){
        case 1:
          for(let i=0;i<5;i++)
            a+=1
          ${varName} = 2
          break

        case 2:
          b+=3
          ${varName} = 0
          break
      }
    `,
      after = `
      switch(${varName}){
        case 1:
          let i=0
          ${varName} = 3
          break
        
        case 2:
          b+=3
          ${varName} = 0
          break

        case 3:
          ${varName} = i<5?4:2
          break
        
        case 4:
          a+=1
          ${varName} = 5
          break
        
        case 5:
          i++
          ${varName} = 3
          break
      }
    `
    let tree = parse(before)
    traverse(tree, {
      SwitchCase(path) {
        astFor(path)
      },
    })
    let bf = generate(tree, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(tree)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })

  it('without init and update', () => {
    let varName = ['ac'],
      before = `
      switch(${varName}){
        case 1:
          for(;i<5;){
            a+=1
            b+=2
          }
          ${varName} = 2
          break

        case 2:
          b+=3
          ${varName} = 0
          break
      }
    `,
      after = `
      switch(${varName}){
        case 1:
          ${varName} = 3
          break
        
        case 2:
          b+=3
          ${varName} = 0
          break

        case 3:
          ${varName} = i<5?4:2
          break
        
        case 4:
          a+=1
          b+=2
          ${varName} = 5
          break
        
        case 5:
          ${varName} = 3
          break
      }
    `
    let tree = parse(before)
    traverse(tree, {
      SwitchCase(path) {
        astFor(path)
      },
    })
    let bf = generate(tree, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(tree)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })

  it('multi init and update', () => {
    let varName = ['a'],
      before = `
      switch(${varName}){
        case 1:
          for(let i=1,j=2;i<5;i++,j--){
            a+=1
            b+=2
          }
          ${varName} = 2
          break

        case 2:
          b+=3
          ${varName} = 0
          break
      }
    `,
      after = `
      switch(${varName}){
        case 1:
          let i=1,j=2
          ${varName} = 3
          break
        
        case 2:
          b+=3
          ${varName} = 0
          break

        case 3:
          ${varName} = i<5?4:2
          break
        
        case 4:
          a+=1
          b+=2
          ${varName} = 5
          break
        
        case 5:
          i++,j--
          ${varName} = 3
          break
      }
    `
    let tree = parse(before)
    traverse(tree, {
      SwitchCase(path) {
        astFor(path)
      },
    })
    let bf = generate(tree, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(tree)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })

  it('init outside', () => {
    let varName = ['acc'],
      before = `
      switch(${varName}){
        case 1:
          for(i=1;i<5;i++){
            a+=1
            b+=2
          }
          ${varName} = 2
          break

        case 2:
          b+=3
          ${varName} = 0
          break
      }
    `,
      after = `
      switch(${varName}){
        case 1:
          i=1
          ${varName} = 3
          break
        
        case 2:
          b+=3
          ${varName} = 0
          break

        case 3:
          ${varName} = i<5?4:2
          break
        
        case 4:
          a+=1
          b+=2
          ${varName} = 5
          break
        
        case 5:
          i++
          ${varName} = 3
          break
      }
    `
    let tree = parse(before)
    traverse(tree, {
      SwitchCase(path) {
        astFor(path)
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

import { expect } from 'chai'
import { astMultiStatement, getCaseParams } from '../src/function/case'
import { parseScript } from 'esprima'
import { SwitchStatement, IfStatement, Program } from 'estree'
import { astExp, ExpOptions } from '../src/expression/expression'
import * as estraverse from 'estraverse'

describe('expression', () => {
  it('secondStatement', () => {
    let names = ['d', 'aa', 'bb'],
      before = `
      switch(${names[0]}){
        case 3:
          c+=1
          ${names[0]} = 0
          break

        case 1:
          ${names[0]} = target['a'+'b'+'c']?2:3
          break
        
        case 2:
          b+=1
          ${names[0]} = 3
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 3:
          c+=1
          ${names[0]} = 0
          break

        case 4:
          ${names[0]} = target[${names[1]}+'c']?2:3
          break

        case 2:
          b+=1
          ${names[0]} = 3
          break
        
        case 1:
          var ${names[1]} = 'a'+'b'
          ${names[0]} = 4
          break
      }
    `
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[1]

    astExp({
      ...(<ExpOptions>getCaseParams(switchCase, switchStatement)),
      node: switchCase.consequent[0].expression.right.test.property,
      varNames: names
    })

    expect(tree).to.eql(parseScript(after))
  })

  it('object', () => {
    let names = ['d', 'aa', 'bb'],
      before = `
      switch(${names[0]}){
        case 3:
          c+=1
          ${names[0]} = 0
          break

        case 1:
          console.log(window['a'+'b'+'c'])
          ${names[0]} = 2
          break
        
        case 2:
          b+=1
          ${names[0]} = 3
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 3:
          c+=1
          ${names[0]} = 0
          break

        case 4:
          console.log(window[${names[1]}+'c'])
          ${names[0]} = 2
          break

        case 2:
          b+=1
          ${names[0]} = 3
          break
        
        case 1:
          var ${names[1]} = 'a'+'b'
          ${names[0]} = 4
          break
      }
    `
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[1]

    astExp({
      ...(<ExpOptions>getCaseParams(switchCase, switchStatement)),
      node: switchCase.consequent[0].expression.arguments[0].property,
      varNames: names
    })

    expect(tree).to.eql(parseScript(after))
  })

  it('argument', () => {
    let names = ['d', 'aa', 'bb'],
      before = `
      switch(${names[0]}){
        case 3:
          c+=1
          ${names[0]} = 0
          break

        case 1:
          console.log(1+2+3)
          ${names[0]} = 2
          break
        
        case 2:
          b+=1
          ${names[0]} = 3
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 3:
          c+=1
          ${names[0]} = 0
          break

        case 4:
          console.log(${names[1]}+3)
          ${names[0]} = 2
          break

        case 2:
          b+=1
          ${names[0]} = 3
          break
        
        case 1:
          var ${names[1]} = 1+2
          ${names[0]} = 4
          break
      }
    `
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[1]

    astExp({
      ...(<ExpOptions>getCaseParams(switchCase, switchStatement)),
      node: switchCase.consequent[0].expression.arguments[0],
      varNames: names
    })

    expect(tree).to.eql(parseScript(after))
  })

  it('string', () => {
    let names = ['d', 'aa', 'bb'],
      before = `
      switch(${names[0]}){
        case 3:
          c+=1
          ${names[0]} = 0
          break

        case 1:
          a=1+'2-3*4+5*2'+'hello'
          ${names[0]} = 2
          break
        
        case 2:
          b+=1
          ${names[0]} = 3
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 3:
          c+=1
          ${names[0]} = 0
          break

        case 4:
          a = ${names[1]}+'hello'
          ${names[0]} = 2
          break

        case 2:
          b+=1
          ${names[0]} = 3
          break
        
        case 1:
          var ${names[1]} = 1+'2-3*4+5*2'
          ${names[0]} = 4
          break
      }
    `
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[1]

    astExp({
      ...(<ExpOptions>getCaseParams(switchCase, switchStatement)),
      node: switchCase.consequent[0].expression.right,
      varNames: names
    })

    expect(tree).to.eql(parseScript(after))
  })

  it('both', () => {
    let names = ['d', 'aa', 'bb'],
      before = `
      switch(${names[0]}){
        case 1:
          a=1+2-3*4+5*2
          ${names[0]} = 2
          break
        
        case 2:
          b+=1
          ${names[0]} = 0
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 4:
          a = ${names[1]}+${names[2]}
          ${names[0]} = 2
          break

        case 2:
          b+=1
          ${names[0]} = 0
          break
        
        case 1:
          var ${names[1]} = 1+2-3*4
          ${names[0]} = 3
          break

        case 3:
          var ${names[2]} = 5*2
          ${names[0]} = 4
          break
      }
    `
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[0]

    astExp({
      ...(<ExpOptions>getCaseParams(switchCase, switchStatement)),
      node: switchCase.consequent[0].expression.right,
      varNames: names
    })

    expect(tree).to.eql(parseScript(after))
  })

  it('right', () => {
    let names = ['d', 'aa', 'bb'],
      before = `
      switch(${names[0]}){
        case 1:
          a=1+5*2
          ${names[0]} = 2
          break
        
        case 2:
          b+=1
          ${names[0]} = 0
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 3:
          a = 1+${names[1]}
          ${names[0]} = 2
          break

        case 2:
          b+=1
          ${names[0]} = 0
          break

        case 1:
          var ${names[1]} = 5*2
          ${names[0]} = 3
          break
      }
    `
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[0]

    astExp({
      ...(<ExpOptions>getCaseParams(switchCase, switchStatement)),
      node: switchCase.consequent[0].expression.right,
      varNames: names
    })

    expect(tree).to.eql(parseScript(after))
  })

  it('left', () => {
    let names = ['d', 'aa', 'bb'],
      before = `
      switch(${names[0]}){
        case 1:
          a=(1+5)*2
          ${names[0]} = 2
          break
        
        case 2:
          b+=1
          ${names[0]} = 0
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 3:
          a = ${names[1]}*2
          ${names[0]} = 2
          break

        case 2:
          b+=1
          ${names[0]} = 0
          break

        case 1:
          var ${names[1]} = 1+5
          ${names[0]} = 3
          break
      }
    `
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[0]

    astExp({
      ...(<ExpOptions>getCaseParams(switchCase, switchStatement)),
      node: switchCase.consequent[0].expression.right,
      varNames: names
    })

    expect(tree).to.eql(parseScript(after))
  })

  it('non expression transform', () => {
    let names = ['d', 'aa', 'bb'],
      before = `
      switch(${names[0]}){
        case 1:
          a=(1+5)
          ${names[0]} = 2
          break
        
        case 2:
          b+=1
          ${names[0]} = 0
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 1:
          a=1+5
          ${names[0]} = 2
          break

        case 2:
          b+=1
          ${names[0]} = 0
          break
      }
    `
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[0]

    astExp({
      ...(<ExpOptions>getCaseParams(switchCase, switchStatement)),
      node: switchCase.consequent[0].expression.right,
      varNames: names
    })

    expect(tree).to.eql(parseScript(after))
  })

  it('object', () => {
    let names = ['d', 'aa', 'bb'],
      before = `
      switch(${names[0]}){
        case 1:
          document.cookie=(1+5)+'1'+'2'
          ${names[0]} = 2
          break
        
        case 2:
          b+=1
          ${names[0]} = 0
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 3:
          document.cookie=${names[1]}+'2'
          ${names[0]} = 2
          break
          
        case 2:
          b+=1
          ${names[0]} = 0
          break

        case 1:
          var ${names[1]} = (1+5)+'1'
          ${names[0]} = 3
          break
      }
    `
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[0]

    astExp({
      ...(<ExpOptions>getCaseParams(switchCase, switchStatement)),
      node: switchCase.consequent[0].expression.right,
      varNames: names
    })

    expect(tree).to.eql(parseScript(after))
  })
})

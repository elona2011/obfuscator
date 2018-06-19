import { expect } from 'chai'
import { astIf, IfOptions } from '../src/loop/if'
import { parseScript } from 'esprima'
import { SwitchStatement, IfStatement } from 'estree'
import { getCaseParams } from '../src/function/case';

describe('if', () => {
  it('single if non-block', () => {
    let names = ['a'],
      before = `
      switch(${names[0]}){
        case 1:
          if(b) b++
          ${names[0]} = 2
          break

        case 2:
          b+=3
          ${names[0]} = 3
          break

        case 3:
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 1:
          ${names[0]} = b?4:2
          break
        
        case 2:
          b+=3
          ${names[0]} = 3
          break

        case 3:
          break
        
        case 4:
          b++
          ${names[0]} = 2
          break
      }
    `
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astIf(<IfOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
  })

  it('single if block', () => {
    let names = ['a'],
      before = `
      switch(${names[0]}){
        case 1:
          if(b){
            b++
            b+=2
          }
          ${names[0]} = 2
          break

        case 2:
          b+=3
          ${names[0]} = 3
          break

        case 3:
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 1:
          ${names[0]} = b?4:2
          break
        
        case 2:
          b+=3
          ${names[0]} = 3
          break

        case 3:
          break
        
        case 4:
          b++
          b+=2
          ${names[0]} = 2
          break
      }
    `
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astIf(<IfOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
  })

  it('if and else', () => {
    let names = ['a'],
      before = `
      switch(${names[0]}){
        case 1:
          if(b){
            b++
            b++
          }else{
            b--
            b++
            b--
          }
          ${names[0]} = 2
          break
        
        case 2:
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 1:
          ${names[0]} = b?3:4
          break

        case 2:
          break
        
        case 3:
          b++
          b++
          ${names[0]} = 2
          break

        case 4:
          b--
          b++
          b--
          ${names[0]} = 2
          break
      }
    `
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astIf(<IfOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
  })

  it('else if', () => {
    let names = ['a'],
      before = `
      switch(${names[0]}){
        case 1:
          if(b){
            b++
          }else if(b>2){
            b--
          }else {
            b+=2
          }
          ${names[0]} = 2
          break
        
        case 2:
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 1:
          ${names[0]} = b?3:4
          break

        case 2:
          break
        
        case 3:
          b++
          ${names[0]} = 2
          break

        case 4:
          if(b>2){
            b--
          }else{
            b+=2
          }
          ${names[0]} = 2
          break
      }
    `
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astIf(<IfOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
  })

  it('multi else if without else', () => {
    let names = ['a'],
      before = `
      switch(${names[0]}){
        case 1:
          if(b){
            b++
          }else if(b>2){
            b--
          }else if(b>3) {
            b+=2
          }
          ${names[0]} = 2
          break
        
        case 2:
          break
      }
    `,
      after = `
      switch(${names[0]}){
        case 1:
          ${names[0]} = b?3:4
          break

        case 2:
          break
        
        case 3:
          b++
          ${names[0]} = 2
          break

        case 4:
          if(b>2){
            b--
          }else if(b>3){
            b+=2
          }
          ${names[0]} = 2
          break
      }
    `
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astIf(<IfOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
  })
})

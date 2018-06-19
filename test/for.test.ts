import { expect } from 'chai'
import { astFor, ForOptions } from '../src/loop/for'
import { parseScript } from 'esprima'
import { generate } from 'escodegen'
import { SwitchStatement, IfStatement, ForStatement } from 'estree'
import { getCaseParams } from '../src/function/case';

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
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astFor(<ForOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
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
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astFor(<ForOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
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
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astFor(<ForOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
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
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astFor(<ForOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
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
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astFor(<ForOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
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
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astFor(<ForOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
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
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astFor(<ForOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
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
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[0]

    astFor(<ForOptions>getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
  })
})

import { expect } from 'chai'
import { astMultiStatement, getCaseParams, astMultiDeclaration, astMultiNextStep } from '../src/function/case'
import { parseScript } from 'esprima'
import { SwitchStatement, IfStatement, Program } from 'estree'

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
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[0]

    astMultiStatement({
      ...getCaseParams(switchCase, switchStatement)
    })

    expect(tree).to.eql(parseScript(after))
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
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[0]

    astMultiDeclaration({
      ...getCaseParams(switchCase, switchStatement)
    })

    expect(tree).to.eql(parseScript(after))
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
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[0]

    astMultiStatement({
      ...getCaseParams(switchCase, switchStatement)
    })

    expect(tree).to.eql(parseScript(after))
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
    let tree: Program = parseScript(before),
      switchStatement = <any>tree.body[0],
      switchCase = switchStatement.cases[0]

    astMultiNextStep({
      ...getCaseParams(switchCase, switchStatement)
    })

    expect(tree).to.eql(parseScript(after))
  })
})

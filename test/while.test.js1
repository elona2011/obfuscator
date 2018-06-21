import { expect } from 'chai'
import { astWhile, astDoWhile } from '../src/loop/while'
import { parseScript } from 'esprima'
import { getCaseParams } from '../src/function/case'

describe('while', () => {
  it('base', () => {
    let varName = ['ab'],
      before = `
      switch(${varName}){
        case 1:
          while(i>1){
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
          ${varName} = i>1?3:2
          break
        
        case 2:
          b+=3
          ${varName} = 0
          break

        case 3:
          a+=1
          b+=2
          ${varName} = 1
          break
      }
    `
    let tree = parseScript(before),
      switchStatement = tree.body[0],
      switchCase = switchStatement.cases[0]

    astWhile(getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
  })

  it('without block', () => {
    let varName = ['af'],
      before = `
      switch(${varName}){
        case 1:
          while(i>1)
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
          ${varName} = i>1?3:2
          break
        
        case 2:
          b+=3
          ${varName} = 0
          break

        case 3:
          a+=1
          ${varName} = 1
          break
      }
    `
    let tree = parseScript(before),
      switchStatement = tree.body[0],
      switchCase = switchStatement.cases[0]

    astWhile(getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
  })

  it('do while', () => {
    let varName = ['ag'],
      before = `
      switch(${varName}){
        case 1:
          do{
            a+=1
            b+=2
          }while(i>1)
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
          a+=1
          b+=2
          ${varName} = 3
          break
        
        case 2:
          b+=3
          ${varName} = 0
          break

        case 3:
          ${varName} = i>1?1:2
          break
      }
    `
    let tree = parseScript(before),
      switchStatement = tree.body[0],
      switchCase = switchStatement.cases[0]

    astDoWhile(getCaseParams(switchCase, switchStatement))
    expect(tree).to.eql(parseScript(after))
  })

  // it('do while without block', () => {
  //   let varName = 'a',
  //     before = `
  //     switch(${varName}){
  //       case 1:
  //         do
  //           a+=1
  //           b+=2
  //         while(i>1)
  //         ${varName} = 2
  //         break

  //       case 2:
  //         b+=3
  //         ${varName} = 0
  //         break
  //     }
  //   `,
  //     after = `
  //     switch(${varName}){
  //       case 1:
  //         a+=1
  //         b+=2
  //         ${varName} = 3
  //         break

  //       case 2:
  //         b+=3
  //         ${varName} = 0
  //         break

  //       case 3:
  //         ${varName} = i>1?1:2
  //         break
  //     }
  //   `
  //   let tree = parseScript(before),
  //     switchStatement = tree.body[0],
  //     switchCase = switchStatement.cases[0]

  //   astDoWhile(getCaseParams(switchCase, switchStatement))
  //   expect(tree).to.eql(parseScript(after))
  // })
})

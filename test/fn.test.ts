import { expect } from 'chai'
import { astFn } from '../src/function/fn'
import { parseScript } from 'esprima'
import {
  SwitchStatement,
  IfStatement,
  Program,
  FunctionDeclaration
} from 'estree'

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
    let { beforeBody, afterBody } = parse(before, after, varName)
    expect(beforeBody).to.eql(afterBody)
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
    let { beforeBody, afterBody } = parse(before, after, names)
    expect(beforeBody).to.eql(afterBody)
  })
})

function parse(before, after, varName) {
  let beforeBody = parseScript(before).body[0],
    afterBody = parseScript(after).body[0]

  astFn({
    node: <FunctionDeclaration>beforeBody,
    names: varName,
    isRoot: false
  })

  return {
    beforeBody,
    afterBody
  }
}

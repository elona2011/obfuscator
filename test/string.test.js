import chai from 'chai'
import { getAllChars } from '../src/literal/string'
import { parse } from '@babel/parser'
const chaiExclude = require('chai-exclude')
import generate from '@babel/generator'

let expect = chai.expect,
  excludeStrArr = ['column', 'line', 'end', 'start', 'loc', 'extra', 'comments']
chai.use(chaiExclude)

describe('string', () => {
  it('getAllChars', () => {
    let before = `
        (function a(){
          var b = 'ac'
          console.log(b,'dd')
        })();
      `

    let tree = parse(before),
      str = getAllChars(tree)

    expect(str).to.deep.equal('acd')
  })

  it('getAllChars', () => {
    let before = `
        (function a(){
          var b = 'ac'
          console.log(b,'dd')
        })();
      `

    let tree = parse(before),
      name = getAllChars(tree),
      after = `
      (function a(){
        var ${name} = 'acd'
        var b = 'ac'
        console.log(b,'dd')
      })();
      `

    let bf = generate(tree, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(tree)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })

  // it('argument', () => {
  //   let names = ['a'],
  //     before = `
  //     switch(${names[0]}){
  //       case 1:
  //         console.log('abcd')
  //         ${names[0]} = 0
  //         break
  //     }
  //   `,
  //     after = `
  //     switch(${names[0]}){
  //       case 1:
  //         console.log(window.String.fromCharCode(97)+window.String.fromCharCode(98)+window.String.fromCharCode(99)+window.String.fromCharCode(100))
  //         ${names[0]} = 0
  //         break
  //     }
  //   `
  //   let tree = parseScript(before),
  //     switchStatement = tree.body[0],
  //     switchCase = switchStatement.cases[0]

  //   replaceNode(switchCase)(astSplitString)
  //   expect(tree).to.eql(parseScript(after))
  // })

  // it('assignment', () => {
  //   let names = ['a'],
  //     before = `
  //     switch(${names[0]}){
  //       case 1:
  //         var d = 'bcdf'
  //         ${names[0]} = 0
  //         break
  //     }
  //   `,
  //     after = `
  //     switch(${names[0]}){
  //       case 1:
  //         var d = window.String.fromCharCode(98)+window.String.fromCharCode(99)+window.String.fromCharCode(100)+window.String.fromCharCode(102)
  //         ${names[0]} = 0
  //         break
  //     }
  //   `
  //   let tree = parseScript(before),
  //     switchStatement = tree.body[0],
  //     switchCase = switchStatement.cases[0]

  //   replaceNode(switchCase)(astSplitString)
  //   expect(tree).to.eql(parseScript(after))
  // })
})

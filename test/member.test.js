import {
  astComputedMember,
  // transformComputedMember,
  // transformComputedMemberName,
} from '../src/expression/member'
import { parseScript } from 'esprima'
import chai from 'chai'
import { parse } from '@babel/parser'
import generate from '@babel/generator'
const chaiExclude = require('chai-exclude')
import traverse from '@babel/traverse'

let expect = chai.expect,
  excludeStrArr = ['column', 'line', 'end', 'start', 'loc', 'extra', 'comments']
chai.use(chaiExclude)

describe('member', () => {
  it('normal', () => {
    let before = `
    a.b.c.d.e
  `,
      after = `
    a["b"]["c"]["d"]["e"]
  `
    let b = parse(before)

    traverse(b, {
      MemberExpression(path) {
        astComputedMember(path)
      },
    })
    let bf = generate(b, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(b)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })

  // it('no assignment', () => {
  //   let before = `
  //   a['b']
  // `,
  //     after = `
  //   ee(dd(false))(a)('98')
  // `
  //   let b = parse(before)

  //   traverse(b, {
  //     MemberExpression(path) {
  //       astComputedMember(path)
  //     },
  //   })
  //   let bf = generate(b, {})
  //   let af = generate(parse(after), {})

  //   expect(bf.code).to.equal(af.code)
  //   expect(b)
  //     .excludingEvery(excludeStrArr)
  //     .to.deep.equal(parse(after))

  //   let tree = parseScript(before)
  //   transformComputedMemberName('ee')('dd')(tree)
  //   expect(tree).to.eql(parseScript(after))
  // })

  // it('call', () => {
  //   let before = `
  //   a['b']()
  // `,
  //     after = `
  //   ee(dd(true))(a)('98')()
  // `

  //   let tree = parseScript(before)
  //   transformComputedMemberName('ee')('dd')(tree)
  //   expect(tree).to.eql(parseScript(after))
  // })

  // it('assignment', () => {
  //   let before = `
  //   a['b']=0
  // `,
  //     after = `
  //   a['b']=0
  // `

  //   let tree = parseScript(before)
  //   transformComputedMember(tree)
  //   expect(tree).to.eql(parseScript(after))
  // })
})

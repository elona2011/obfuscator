import { expect } from 'chai'
import { astComputedMember, transformComputedMember, transformComputedMemberName } from '../src/expression/member'
import { parseScript } from 'esprima'
import { traverseNode, validateTypes } from '../src/utils/traverse'

describe('member', () => {
  it('normal', () => {
    let before = `
    a.b.c.d.e
  `,
      after = `
    a['b']['c']['d']['e']
  `

    let tree = parseScript(before)
    traverseNode(tree)(validateTypes(['MemberExpression'])(astComputedMember))
    expect(tree).to.eql(parseScript(after))
  })

  it('no assignment', () => {
    let before = `
    a['b']
  `,
      after = `
    ee(dd(false))(a)('98')
  `

    let tree = parseScript(before)
    transformComputedMemberName('ee')('dd')(tree)
    expect(tree).to.eql(parseScript(after))
  })

  it('call', () => {
    let before = `
    a['b']()
  `,
      after = `
    ee(dd(true))(a)('98')()
  `

    let tree = parseScript(before)
    transformComputedMemberName('ee')('dd')(tree)
    expect(tree).to.eql(parseScript(after))
  })

  it('assignment', () => {
    let before = `
    a['b']=0
  `,
      after = `
    a['b']=0
  `

    let tree = parseScript(before)
    transformComputedMember(tree)
    expect(tree).to.eql(parseScript(after))
  })
})

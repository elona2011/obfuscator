import chai from 'chai'
import { astIf } from '../src/loop/if'
import { parse } from '@babel/parser'
import generate from '@babel/generator'
const chaiExclude = require('chai-exclude')
import traverse from '@babel/traverse'

let expect = chai.expect,
  excludeStrArr = ['column', 'line', 'end', 'start', 'loc', 'extra', 'comments']
chai.use(chaiExclude)

describe('if', () => {
  it('single if non-block', () => {
    let names = ['a'],
      before = `
      switch(${names[0]}){
        case 1:
          if(b) b++;
          ${names[0]} = 2;
          break;

        case 2:
          b+=3;
          ${names[0]} = 3;
          break;

        case 3:
          break;
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
    let b = parse(before)

    traverse(b, {
      SwitchCase(path) {
        astIf(path)
      },
    })
    let bf = generate(b, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(b)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
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
    let b = parse(before)

    traverse(b, {
      SwitchCase(path) {
        astIf(path)
      },
    })
    let bf = generate(b, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(b)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
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
    let b = parse(before)

    traverse(b, {
      SwitchCase(path) {
        astIf(path)
      },
    })
    let bf = generate(b, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(b)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
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
    let b = parse(before)

    traverse(b, {
      SwitchCase(path) {
        astIf(path)
      },
    })
    let bf = generate(b, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(b)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
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
    let b = parse(before)

    traverse(b, {
      SwitchCase(path) {
        astIf(path)
      },
    })
    let bf = generate(b, {})
    let af = generate(parse(after), {})

    expect(bf.code).to.equal(af.code)
    expect(b)
      .excludingEvery(excludeStrArr)
      .to.deep.equal(parse(after))
  })
})

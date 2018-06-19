// import { expect } from 'chai'
// import { astIf, IfOptions } from '../src/service/if'
// import { parseScript } from 'esprima'
// import { SwitchStatement, IfStatement } from 'estree'
// import { getCaseParams } from '../src/service/case'
// import { transformWindow, transformProperty } from '../src/service/transform'

// describe('property', () => {
//   it('String.fromCharCode', () => {
//     let names = ['a'],
//       before = `
//       switch(${names[0]}){
//         case 1:
//           console.log(window.String.fromCharCode)
//           ${names[0]} = 0
//           break
//       }
//     `,
//       after = `
//       switch(${names[0]}){
//         case 1:
//           console.log(StringFromCharCode())
//           ${names[0]} = 0
//           break
//       }
//     `
//     let tree = parseScript(before),
//       switchStatement = <SwitchStatement>tree.body[0],
//       switchCase = switchStatement.cases[0]

//     transformProperty(switchCase)
//     expect(tree).to.eql(parseScript(after))
//   })


// })

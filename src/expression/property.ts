// import { Node, Literal, BinaryExpression, MemberExpression } from 'estree'
// import * as estraverse from 'estraverse'
// import { generate } from 'escodegen'
// import { parseScript } from 'esprima'
// import { replaceNode } from './traverse';
// const JSDOM = require("jsdom").JSDOM;

// const { window } = new JSDOM(`...`);

// const raw = `
//   function name(key, obj){
//     for(let n of obj){
//       if(n.length === key.length){
        
//       }
//     }
//   }
// `

// function astProperty(node: MemberExpression): BinaryExpression | undefined {
//   let nameArr = getMemberExpressionArr(node)
//   if (nameArr[0] === 'window') {
//     node
//     window


//   }
// }

// function is(params:type) {
  
// }

// function getMemberExpressionArr(node: MemberExpression) {
//   let nameArr: string[] = []

//   node.property.type === 'Identifier' && nameArr.unshift(node.property.name)
//   while (node.object.type === 'MemberExpression') {
//     node = node.object
//     node.property.type === 'Identifier' && nameArr.unshift(node.property.name)
//   }
//   node.object.type === 'Identifier' && nameArr.unshift(node.object.name)
//   return nameArr
// }

// export { astProperty }

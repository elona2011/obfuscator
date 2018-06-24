const { transformMain } = require('./lib')
const { parse } = require('@babel/parser')

module.exports = function obfuscate(code, options) {
  let tree = parse(code),
    newTree = transformMain(tree, options)

  return newTree
}

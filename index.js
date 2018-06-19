const { transformMain } = require('./build')
const { parseScript } = require('esprima')

module.exports = function obfuscate(code, options) {
  let tree = parseScript(code),
    newTree = transformMain(tree, options)

  return newTree
}
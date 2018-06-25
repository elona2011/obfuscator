import { transformFn, afterFn } from './main'

export const transformOptionsDefault = {
  disorderCase: true,
  numberToArray: true,
  splitString: false,
  compileTarget: 'es3',
}

/**
 * main transform
 * @param tree
 */
export function transformMain(tree, options) {
  Object.keys(transformOptionsDefault).forEach(n => {
    if (options[n] === undefined) {
      options[n] = transformOptionsDefault[n]
    }
  })

  transformFn(tree, options)
  afterFn(tree, options)

  return tree
}

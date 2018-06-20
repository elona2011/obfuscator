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
export function transformMain(tree, options = transformOptionsDefault) {
  transformFn(tree, options)
  // afterFn(tree, options)

  return tree
}

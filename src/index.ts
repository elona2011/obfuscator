import { Node } from 'estree'
import { transformFn, afterFn } from './main'

export interface transformOptions {
  disorderCase?: boolean //case顺序打乱
  numberToArray?: boolean //caseNum转多维数组
  splitString?: boolean //字符串拆分
  compileTarget?: string //es3/es5
}

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
export function transformMain(tree: Node, options: transformOptions = transformOptionsDefault) {
  transformFn(tree, options)
  // afterFn(tree, options)

  return tree
}

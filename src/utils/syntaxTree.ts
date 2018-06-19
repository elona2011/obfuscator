import {
  BreakStatement,
  MemberExpression,
  Statement,
  ExpressionStatement,
  BlockStatement,
  SwitchCase,
  VariableDeclaration,
  VariableDeclarator,
  Expression,
  AssignmentExpression,
  Literal,
} from 'estree'

export const getNextStep = (stepName: string, nextNum: number): ExpressionStatement => newExpressionStatement(newAssignmentExpression(stepName, nextNum))

export function getMemberExpression(name: string, valueArr: number[]): MemberExpression {
  if (valueArr.length === 0) throw 'valueArr.length should above 0!'

  let r: any = {
    type: 'MemberExpression',
    computed: true,
    property: getLiteral(valueArr[0]),
    object: {
      type: 'Identifier',
      name,
    },
  }
  for (let i = 1; i < valueArr.length; i++) {
    r = {
      type: 'MemberExpression',
      computed: true,
      property: getLiteral(valueArr[i]),
      object: r,
    }
  }
  return r
}

export const getCallExpression3 = (calleeName: string, arg1Name: string, arg1IsCall: boolean, arg2: any, arg3: any) => ({
  type: 'CallExpression',
  callee: {
    type: 'CallExpression',
    callee: {
      type: 'CallExpression',
      callee: getIdentifier(calleeName),
      arguments: [
        {
          type: 'CallExpression',
          callee: getIdentifier(arg1Name),
          arguments: [getLiteral(arg1IsCall)],
        },
      ],
    },
    arguments: [arg2],
  },
  arguments: [arg3],
})

export const newVariableDeclaration = (declaration: VariableDeclarator): VariableDeclaration => ({
  declarations: [declaration],
  kind: 'var',
  type: 'VariableDeclaration',
})

export const newExpressionStatement = (expression: Expression): ExpressionStatement => ({
  expression,
  type: 'ExpressionStatement',
})

export const newAssignmentExpression = (stepName: string, nextNum: number): AssignmentExpression => ({
  left: { name: stepName, type: 'Identifier' },
  operator: '=',
  right: getLiteral(nextNum),
  type: 'AssignmentExpression',
})

export const createNewCase = (stepName: string, caseNum: number, nextNum: number): SwitchCase => ({
  consequent: [getNextStep(stepName, nextNum), getBreakStatement()],
  test: { raw: caseNum + '', type: 'Literal', value: caseNum },
  type: 'SwitchCase',
})

const getIdentifier = (name: string) => ({
  type: 'Identifier',
  name,
})

export const getLiteral = (value: string | boolean | null | number): Literal => ({
  type: 'Literal',
  value,
  raw: typeof value === 'string' ? `'${value}'` : value + '',
})

export const getBlockStatement = (body: Statement[]): BlockStatement => ({
  body,
  type: 'BlockStatement',
})

export const getBreakStatement = (): BreakStatement => ({
  label: null,
  type: 'BreakStatement',
})

export function isNextStep(node: Statement, stepName: string): boolean {
  if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression' && node.expression.left.type === 'Identifier' && node.expression.left.name === stepName) {
    return true
  } else return false
}

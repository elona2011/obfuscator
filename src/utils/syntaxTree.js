export const getNextStep = (stepName, nextNum) =>
  newExpressionStatement(newAssignmentExpression(stepName, nextNum))

export function getMemberExpression(name, valueArr) {
  if (valueArr.length === 0) throw 'valueArr.length should above 0!'

  let r = {
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

export const getCallExpression3 = (calleeName, arg1Name, arg1IsCall, arg2, arg3) => ({
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

export const newVariableDeclaration = declaration => ({
  declarations: [declaration],
  kind: 'var',
  type: 'VariableDeclaration',
})

export const newExpressionStatement = expression => ({
  expression,
  type: 'ExpressionStatement',
})

export const newAssignmentExpression = (stepName, nextNum) => ({
  left: { name: stepName, type: 'Identifier' },
  operator: '=',
  right: getLiteral(nextNum),
  type: 'AssignmentExpression',
})

export const createNewCase = (stepName, caseNum, nextNum) => ({
  consequent: [getNextStep(stepName, nextNum), getBreakStatement()],
  test: { raw: caseNum + '', type: 'Literal', value: caseNum },
  type: 'SwitchCase',
})

const getIdentifier = name => ({
  type: 'Identifier',
  name,
})

export const getLiteral = value => ({
  type: 'Literal',
  value,
  raw: typeof value === 'string' ? `'${value}'` : value + '',
})

export const getBlockStatement = body => ({
  body,
  type: 'BlockStatement',
})

export const getBreakStatement = () => ({
  label: null,
  type: 'BreakStatement',
})

export function isNextStep(node, stepName) {
  if (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'AssignmentExpression' &&
    node.expression.left.type === 'Identifier' &&
    node.expression.left.name === stepName
  ) {
    return true
  } else return false
}

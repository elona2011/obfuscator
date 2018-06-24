import * as t from 'babel-types'

export const getNextStep = (stepName, nextNum) =>
  t.expressionStatement(newAssignmentExpression(stepName, nextNum))

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

export const getCallExpression3 = (
  calleeName,
  arg1Name,
  arg1IsCall,
  arg2,
  arg3
) => ({
  type: 'CallExpression',
  callee: {
    type: 'CallExpression',
    callee: {
      type: 'CallExpression',
      callee: t.identifier(calleeName),
      arguments: [
        {
          type: 'CallExpression',
          callee: t.identifier(arg1Name),
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

export const newAssignmentExpression = (stepName, nextNum) => {
  return t.assignmentExpression(
    '=',
    t.identifier(stepName),
    t.numericLiteral(nextNum)
  )
}

export const createNewCase = (stepName, caseNum, nextNum) =>
  t.switchCase(t.numericLiteral(caseNum), [
    getNextStep(stepName, nextNum),
    t.breakStatement(),
  ])

export const getLiteral = value => ({
  type: 'Literal',
  value,
  raw: typeof value === 'string' ? `'${value}'` : value + '',
})

export const getBlockStatement = body => ({
  body,
  type: 'BlockStatement',
})

export function isNextStep(node, stepName) {
  if (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'AssignmentExpression' &&
    node.expression.operator === '=' &&
    node.expression.left.type === 'Identifier' &&
    node.expression.left.name === stepName
  ) {
    return true
  } else return false
}

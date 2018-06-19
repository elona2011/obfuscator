import { expect } from 'chai'
import { getWindow } from '../../src/service/object'

describe('object', () => {
  it(`len=default`, () => {
    expect(getWindow()).to.eql(window)
  })
})
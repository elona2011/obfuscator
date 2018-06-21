import { expect } from 'chai'
import { getLoopArr, getArrParam } from '../src/expression/array'
debugger
describe('array', () => {
  it(`len=default`, () => {
    let arr = getLoopArr(),
      param1 = getArrParam(0),
      param2 = getArrParam(0),
      param3 = getArrParam(10),
      param4 = getArrParam(10),
      param5 = getArrParam(21),
      param6 = getArrParam(21)

    expect(arr[param1[0]][param1[1]][param1[2]]).to.equal(arr[param2[0]][param2[1]][param2[2]])
    expect(arr[param3[0]][param3[1]][param3[2]]).to.equal(arr[param4[0]][param4[1]][param4[2]])
    expect(arr[param5[0]][param5[1]][param5[2]]).to.equal(arr[param6[0]][param6[1]][param6[2]])
  })

  it(`len=2`, () => {
    let arr = getLoopArr(47, 7, 2),
      param1 = getArrParam(0),
      param2 = getArrParam(0),
      param3 = getArrParam(10),
      param4 = getArrParam(10),
      param5 = getArrParam(21),
      param6 = getArrParam(21)

    expect(arr[param1[0]][param1[1]]).to.equal(arr[param2[0]][param2[1]])
    expect(arr[param3[0]][param3[1]]).to.equal(arr[param4[0]][param4[1]])
    expect(arr[param5[0]][param5[1]]).to.equal(arr[param6[0]][param6[1]])
  })

  it(`len=3`, () => {
    let arr = getLoopArr(37, 3, 3),
      param1 = getArrParam(0),
      param2 = getArrParam(0),
      param3 = getArrParam(10),
      param4 = getArrParam(10),
      param5 = getArrParam(21),
      param6 = getArrParam(21)

    expect(arr[param1[0]][param1[1]][param1[2]]).to.equal(arr[param2[0]][param2[1]][param2[2]])
    expect(arr[param3[0]][param3[1]][param3[2]]).to.equal(arr[param4[0]][param4[1]][param4[2]])
    expect(arr[param5[0]][param5[1]][param5[2]]).to.equal(arr[param6[0]][param6[1]][param6[2]])
  })

  it(`len=4`, () => {
    let arr = getLoopArr(161, 7, 4),
      param1 = getArrParam(0),
      param2 = getArrParam(0),
      param3 = getArrParam(10),
      param4 = getArrParam(10),
      param5 = getArrParam(31),
      param6 = getArrParam(31)

    expect(arr[param1[0]][param1[1]][param1[2]][param1[3]]).to.equal(
      arr[param2[0]][param2[1]][param2[2]][param2[3]]
    )
    expect(arr[param3[0]][param3[1]][param3[2]][param3[3]]).to.equal(
      arr[param4[0]][param4[1]][param4[2]][param4[3]]
    )
    expect(arr[param5[0]][param5[1]][param5[2]][param5[3]]).to.equal(
      arr[param6[0]][param6[1]][param6[2]][param6[3]]
    )
    expect(arr[136][138][143][10]).to.equal(arr[54][58][47][87])
  })
})

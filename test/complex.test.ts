import { expect } from 'chai'
import {
  astMultiStatement,
  getCaseParams,
  astMultiDeclaration,
  astMultiNextStep,
} from '../src/function/case'
import { parseScript } from 'esprima'
import { SwitchStatement, IfStatement, Program, FunctionDeclaration } from 'estree'
import { astIf, IfOptions } from '../src/loop/if'
import { transformConsequent } from '../src/function/case'
import { transformStatement } from '../src/loop/statement';

describe('complex', () => {
  it('multi if', () => {
    let varName = ['kED4'],
      before = `
        switch (kED4) {
        case 1:
            var step0 = len * len * 30 * 50 - 50;
            kED4 = 3;
            break;
        case 2:
            kED4 = time < step0 ? 5 : 6;
            break;
        case 3:
            var step1 = step0 + len * len * 20 * 500 - 500;
            kED4 = 4;
            break;
        case 4:
            var step2 = step1 + len * len * 14 * 5000 - 5000;
            kED4 = 2;
            break;
        case 5:
            var time50 = Math.floor(time / 50);
            kED4 = 7;
            break;
        case 6:
            if (time < step1) {
                var time500 = Math.floor((time - step0) / 500), r = getParams(time500, 3);
                r[r.length - 1] += 30;
                 r;
            } else if (time < step2) {
                var time5000 = Math.floor((time - step1) / 5000), r = getParams(time5000, 3);
                r[r.length - 1] += 50;
                 r;
            } else {
                 [
                    len - 1,
                    len - 1,
                    len - 1
                ];
            }
            kED4 = 7;
            break;
        case 7:
             getParams(time50, 3);
            kED4 = 0;
            break;
        }
    `,
      after = `
        switch (kED4) {
        case 1:
            var step0 = len * len * 30 * 50 - 50;
            kED4 = 3;
            break;
        case 2:
            kED4 = time < step0 ? 5 : 6;
            break;
        case 3:
            var step1 = step0 + len * len * 20 * 500 - 500;
            kED4 = 4;
            break;
        case 4:
            var step2 = step1 + len * len * 14 * 5000 - 5000;
            kED4 = 2;
            break;
        case 5:
            var time50 = Math.floor(time / 50);
            kED4 = 7;
            break;
        case 6:
            kED4 = time < step1 ? 8 : 9;
            break;
        case 7:
             getParams(time50, 3);
            kED4 = 0;
            break;
        case 8:
            var time500 = Math.floor((time - step0) / 500);
            kED4 = 12;
            break;
        case 9:
            if (time < step2) {
                var time5000 = Math.floor((time - step1) / 5000), r = getParams(time5000, 3);
                r[r.length - 1] += 50;
                 r;
            } else {
                 [
                    len - 1,
                    len - 1,
                    len - 1
                ];
            }
            kED4 = 7;
            break;
        case 10:
            r[r.length - 1] += 30;
            kED4 = 11;
            break;
        case 11:
             r;
            kED4 = 7;
            break;
        case 12:
            var r = getParams(time500, 3);
            kED4 = 10;
            break;
        }
    `
    let tree = parseScript(before),
      switchStatement = <SwitchStatement>tree.body[0],
      switchCase = switchStatement.cases[5]

    astIf(<IfOptions>getCaseParams(switchCase, switchStatement))
    transformConsequent(tree)
    expect(tree).to.eql(parseScript(after))

    expect(tree).to.eql(parseScript(after))
  })
})

describe('embedded statement', () => {
  it('for and if', () => {
    let varName = ['k'],
      before = `
      function b(){
         switch(k) {
             case 1:
                for(let i=0;i<10;i++){
                    if(i>9)a++
                }
                k = 2
                break;
            case 2:
            k=0
            break;
         }
        }
      `,
      after = `
      function b(){
          switch(k){
              case 1:
                let i=0;
                k=3;
                break;
            case 2:
            k=0
            break;
            case 3:
                k=i<10?4:2
                break;
            case 4:
                k=i>9?6:5
                break;
            case 5:
                i++
                k=3
                break;
            case 6:
                a++
                k=5
                break;
          }}
      `
    let tree = parseScript(before),
      switchStatement = <FunctionDeclaration>tree.body[0]

    transformStatement(switchStatement)
    expect(tree).to.eql(parseScript(after))
  })
})

# A js obfuscate tool

[![npm](https://img.shields.io/npm/v/yamu-obfuscator.svg)](https://www.npmjs.com/package/yamu-obfuscator)
[![Build status](https://ci.appveyor.com/api/projects/status/4ulfcghj5r67sw9n/branch/master?svg=true)](https://ci.appveyor.com/project/elona2011/yamu-obfuscator/branch/master)
[![Build Status](https://travis-ci.org/elona2011/yamu-obfuscator.svg?branch=master)](https://travis-ci.org/elona2011/yamu-obfuscator)
[![Coverage Status](https://coveralls.io/repos/github/elona2011/yamu-obfuscator/badge.svg?branch=master)](https://coveralls.io/github/elona2011/yamu-obfuscator?branch=master)

* hide global window object

# Install

```
npm install yamu-obfuscator --dev
```

# Build

```
npm run build
```

# Usage

```js
const obfuscate = require('yamu-obfuscator')

let code = readFileSync(process.cwd() + '/build/codeTest.js', 'utf8')
let tree = parseScript(code)
let obfuscatedTree = obfuscate(tree, {
  disorderCase: false,
  numberToArray: false
})
let newCode = generate(obfuscatedTree, {
  format: {
    compact: true
  }
})

writeFileSync(process.cwd() + '/build/bundle.js', newCode)
```

# Example

source code:

```js
a()
function a() {
  var b = 1
  if (b > 100) {
    b-=1
  } else if(b>101){
    b++
  } else if(b>102){
    b+=2
  }
  console.log(b)
}
```

obfuscated code:

```js
a();
function a() {
    var ViIC = function loopArray(arrNum, offset) {
        var Pr1x = 1;
        while (Pr1x !== 0) {
            switch (Pr1x) {
            case 1:
                var arr = [], i = 0, ii = 0;
                Pr1x = 2;
                break;
            case 2:
                Pr1x = i < arrNum ? 5 : 3;
                break;
            case 3:
                Pr1x = ii < arrNum ? 6 : 4;
                break;
            case 4:
                return arr;
                Pr1x = 0;
                break;
            case 12:
                arr[EAai % arrNum] = [];
                Pr1x = 7;
                break;
            case 6:
                var I = arrNum - 1;
                Pr1x = 8;
                break;
            case 7:
                i++;
                Pr1x = 2;
                break;
            case 8:
                Pr1x = I >= 0 ? 10 : 9;
                break;
            case 9:
                ii++;
                Pr1x = 3;
                break;
            case 13:
                arr[ii][auyO % arrNum] = arr[I];
                Pr1x = 11;
                break;
            case 11:
                I--;
                Pr1x = 8;
                break;
            case 5:
                var EAai = i + offset;
                Pr1x = 12;
                break;
            case 14:
                var auyO = I + e98B;
                Pr1x = 13;
                break;
            case 10:
                var e98B = offset * ii;
                Pr1x = 14;
                break;
            }
        }
    }(9, 7);
    var oGOV = ViIC[8][1][3][8];
    while (oGOV !== ViIC[3][4][2][1]) {
        switch (oGOV) {
        case ViIC[1][8][7][1]:
            var b = 1;
            oGOV = ViIC[7][6][4][4];
            break;
        case ViIC[4][5][1][2]:
            oGOV = b > 100 ? ViIC[1][3][3][5] : ViIC[4][2][3][4];
            break;
        case ViIC[2][6][2][4]:
            console.log(b);
            oGOV = ViIC[0][1][4][6];
            break;
        case ViIC[5][4][3][5]:
            b -= 1;
            oGOV = ViIC[0][1][3][2];
            break;
        case ViIC[0][0][5][4]:
            oGOV = b > 101 ? ViIC[4][2][6][8] : ViIC[0][6][6][7];
            break;
        case ViIC[3][8][2][0]:
            b++;
            oGOV = ViIC[0][1][3][2];
            break;
        case ViIC[4][1][8][0]:
            oGOV = b > 102 ? ViIC[8][0][2][3] : ViIC[4][4][6][6];
            break;
        case ViIC[3][4][6][1]:
            b += 2;
            oGOV = ViIC[0][1][3][2];
            break;
        }
    }
}
```

# Test

```
npm test
```

# ToDo

* label(break,continue)
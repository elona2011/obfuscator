const usedNames: string[] = []

export const hashCode = (s: string) => {
  var hash = 0,
    i,
    chr
  if (s.length === 0) return hash
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

/**
 *
 */
export function getVarName(num: number): string[] {
  let r = []

  for (let i = 0; i < num; i++) {
    let name = getRandomName()

    while (usedNames.find(n => n === name)) {
      name = getRandomName()
    }
    usedNames.push(name)
    r.push(name)
  }

  return r
}

function getRandomName(): string {
  let abc = getAlphabet(),
    abc0 = getChars() + '$_',
    r = abc[Math.floor(Math.random() * abc.length)]

  for (let i = 0; i < 3; i++) {
    r += abc0[Math.floor(Math.random() * abc0.length)]
  }

  return r
}

/**
 * 返回52个字母A-Za-z
 */
const getAlphabet = () => {
  let s = ''
  for (let i = +(4 + '8'); i < +(1 + '2' + 3); i++) {
    s += String.fromCharCode(i)
  }
  return s.slice(17, 43) + s.slice(49)
}

/**
 * 返回62个字母数字0-9A-Za-z
 */
const getChars = () => {
  let s = ''
  for (let i = +(4 + '8'); i < +(1 + '2' + 3); i++) {
    s += String.fromCharCode(i)
  }
  return s.slice(0, 10) + s.slice(17, 43) + s.slice(49)
}

export function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export function getProperty(strArr: string[]) {
  return function(fn: Function) {
    function hashCode(s: string) {
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

    return function(obj: any) {
      let names: string[] = [],
        r = ''

      return function(hash: string) {
        for (let n in obj) {
          if (n && hashCode(n) + '' === hash) {
            names.push(n)
          }
        }
        if (names.length === 1) {
          return fn(obj)([names[0]])
        } else {
          for (let i = 0; i < strArr.length; i++) {
            if (hashCode(strArr[i]) + '' === hash) {
              r = strArr[i]
            }
          }
          return fn(obj)([r])
        }
      }
    }
  }
}

export function wrapReturn(isCall: boolean) {
  return function(obj: any) {
    return function(prop: string) {
      if (isCall) {
        return function() {
          return obj[prop].apply(obj, arguments)
        }
      } else {
        return obj[prop]
      }
    }
  }
}

require('babel-register')({
  ignore: function(filename) {
    if (/node_modules/.test(filename)) {
      if (/yamutils/.test(filename)) {
        return false
      }
      return true
    }
    return false
  },
})

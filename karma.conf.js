module.exports = function (config) {
  config.set({
    frameworks: [
      'mocha',
      'chai',
      'detectBrowsers',
      'karma-typescript'
    ],
    files: [
      { pattern: 'src/service/object.js' },
      { pattern: 'test/object.test.js' },
    ],
    preprocessors: {
      'src/service/*.js': ['babel'],
      'test/*.test.js': ['babel']
    },
    client: {
      mocha: {
        reporter: 'html',
        ui: 'bdd'
      }
    },
    babelPreprocessor: {
      options: {
        presets: ['env'],
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },
    karmaTypescriptConfig: {
      include: {
        mode: "replace",
        values: ["src/service/object.ts", 'test/object.test.ts']
      }
    },
    singleRun: true,
    colors: true,
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection: function (availableBrowser) {
        //Add IE Emulation
        var result = availableBrowser;

        if (availableBrowser.indexOf('IE') > -1) {
          result.push('IE10');
          result.push('IE9');
        }

        //Remove PhantomJS if another browser has been detected
        if (availableBrowser.length > 1 && availableBrowser.indexOf('PhantomJS') > -1) {
          var i = result.indexOf('PhantomJS');

          if (i !== -1) {
            result.splice(i, 1);
          }
        }

        return result;
      }
    },
    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-detect-browsers',
      'karma-typescript',
      'karma-babel-preprocessor'
    ],
    customLaunchers: {
      IE9: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE9'
      },
      IE10: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE10'
      }
    }
  });
}
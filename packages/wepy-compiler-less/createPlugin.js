const fs = require('fs');
const less = require('less');
const loaderUtils = require('loader-utils');

const matchMalformedModuleFilename = /(~[^/\\]+)\.less$/;
const isModuleName = /^~[^/\\]+$/;

function createPlugin (compliation) {
  class aliasManager extends less.FileManager {
    supports () {
      return true;
    }
    loadFile (filename, dir, options) {
      let url;
      if (less.version[0] >= 3) {
        if (options.ext && !isModuleNmae.test(filename)) {
          url = this.tryAppendExtension(filename, options.ext);
        } else {
          url = filename;
        }
      } else {
        url = filename.replace(matchMalformedModuleFilename, '$1');
      }
      const moduleRequest = loaderUtils.urlToRequest(
        url,
        url.charAt(0) === '/' ? '' : null
      );

      return compliation.resolvers.normal.resolve({}, compliation.context, moduleRequest, {}).then(rst => {
        return {
          contents: fs.readFileSync(rst.path, 'utf-8'),
          filename: rst.path
        };
      }).catch(e => {
        compliation.logger.error(e);
      });
    }
  }

  return {
    install (instance, pluginManager) {
      pluginManager.addFileManager(new aliasManager());
    },
    minVersion: [2, 1, 1]
  };
}

exports = module.exports = createPlugin;

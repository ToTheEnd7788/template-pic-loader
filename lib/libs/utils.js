"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.response = exports.promises = void 0;

var promises = function promises(ctx, tags) {
  var pros = tags.reduce(function (acc, tag) {
    acc.push(new Promise(function (res, rej) {
      ctx.loadModule(tag.value, function (err, source) {
        if (err) rej(err);
        res({
          source: source,
          tag: tag
        });
      });
    }));
    return acc;
  }, []);
  return pros;
},
    response = function response(_ref, _ref2, source) {
  var loaders = _ref.loaders,
      index = _ref.loaderIndex;
  var extract = _ref2.extract,
      minimize = _ref2.minimize;
  var result;

  if (extract) {
    result = '// Extracted by 「template-pic-loader」';
  } else {
    // Is Last Loader Or Not
    if (index < loaders.length - 1) result = source;else result = "export default ".concat(JSON.stringify(source));
  }

  return result;
};

exports.response = response;
exports.promises = promises;
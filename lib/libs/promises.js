"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(ctx, tags) {
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
};

exports.default = _default;
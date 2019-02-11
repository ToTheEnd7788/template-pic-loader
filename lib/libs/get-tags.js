"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(opts, source) {
  var conditions = opts.condition,
      tagsInfo = [];
  tagsInfo = conditions.reduce(function (acc, item) {
    var conArray = item.split(':'),
        attrName = conArray[1],
        tagName = conArray[0].split('?')[0],
        signAttr = conArray[0].split('?')[1] || '',
        signName = signAttr ? signAttr.split('=')[0] : '',
        signVal = signAttr ? signAttr.split('=')[1] : '',
        signExtra = signName && signVal ? "".concat(signName, "=\"[\\s\\S]*").concat(signVal, "[\\s\\S]*") : '';
    var tags = source.match(new RegExp("<[\\s]*".concat(tagName, "[\\s\\S]*").concat(signExtra, "?\"[\\/]?>"), 'g'));
    var reg = new RegExp("(?<=".concat(attrName, "[\\s]?=[\\s]?[\\\"\\']).*?(?=[\\\"\\'])"), 'g');
    tags.forEach(function (tagStr) {
      acc.push({
        tag: tagStr,
        value: tagStr.match(reg) ? tagStr.match(reg)[0] : ''
      });
    });
    return acc;
  }, []);
  return tagsInfo;
};

exports.default = _default;
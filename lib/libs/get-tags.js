"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GetTags =
/*#__PURE__*/
function () {
  function GetTags(opts, source) {
    _classCallCheck(this, GetTags);

    this.condition = opts.condition;
    this.source = source;
    this.tagMap;
    this.tagsInfo;
  }

  _createClass(GetTags, [{
    key: "init",
    value: function init() {
      if (this.condition) {
        this.cleanSource();
        this.tagMap = this.buildTagMap();
        this.updateTagsInfo();
      }
    } // Ignore Conmments And Delete Module/Export Beginner 

  }, {
    key: "cleanSource",
    value: function cleanSource() {
      this.source = this.source.trim().replace(/^(export[\s]default)|(module.exports[\s]=)[\s]+/, '').replace(/<!--[\S\s]*?-->/g, '');
    } // Build Target Tag map

  }, {
    key: "buildTagMap",
    value: function buildTagMap() {
      return this.condition.reduce(function (acc, item) {
        var baseList = item.split(':'),
            sepList = baseList[0].trim().split('?'),
            signAttrs = null;

        if (sepList.length > 1) {
          var signList = sepList[1].trim().split('&');
          signAttrs = signList.reduce(function (fresh, sStr) {
            var keyVList = sStr.trim().split('=');

            if (keyVList.length === 2 && keyVList[1].trim() !== '') {
              fresh.push({
                sName: keyVList[0].trim(),
                sValue: keyVList[1].trim()
              });
            }

            return fresh;
          }, []);
        }

        acc.push({
          tName: sepList[0],
          signAttrs: signAttrs,
          attr: baseList[1].trim()
        });
        return acc;
      }, []);
    } // Update 'tagMap' Based On tName

  }, {
    key: "updateTagsInfo",
    value: function updateTagsInfo() {
      var _this = this;

      this.tagsInfo = this.tagMap.reduce(function (acc, item) {
        var allTags = _this.source.match(new RegExp("<".concat(item.tName, "[\\s\\S]*?[\\s]*[\\/]?>"), 'g')),
            tags = allTags || [];

        if (item.signAttrs) {
          var signExpStr = '';
          signExpStr = item.signAttrs.reduce(function (str, sign) {
            str = signExpStr + "(?<=".concat(sign.sName, "[\\s]?=[\\s]?['\"][\\s\\S]*").concat(sign.sValue, "[\\s\\S]*['\"])");
            return str;
          }, '');
          tags = allTags.filter(function (tag) {
            return new RegExp(signExpStr, '').test(tag);
          });
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = tags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var tag = _step.value;
            var tempVal = tag.match(new RegExp("(?<=".concat(item.attr, "[s]*=[s]*['\"])[^'\"]+(?=['\"])"), 'g'));

            if (tempVal && tempVal[0]) {
              acc.push({
                tag: tag,
                value: tempVal[0]
              });
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return acc;
      }, []);
    }
  }]);

  return GetTags;
}();

var _default = GetTags;
exports.default = _default;
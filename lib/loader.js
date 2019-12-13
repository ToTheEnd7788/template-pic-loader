"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

var _path = _interopRequireDefault(require("path"));

var _schemaUtils = _interopRequireDefault(require("schema-utils"));

var _getTags = _interopRequireDefault(require("./libs/get-tags"));

var _minimize = _interopRequireDefault(require("minimize"));

var _utils = require("./libs/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(source) {
  var _this = this;

  var schemaOpts = {
    type: "object",
    properties: {
      extract: {
        type: 'boolean'
      },
      condition: {
        type: 'array'
      },
      filename: {
        type: 'string'
      },
      minimize: {
        type: 'boolean'
      },
      minopt: {
        type: 'object'
      }
    },
    additionalProperties: false
  },
      defOpts = {
    extract: true,
    condition: null,
    minopt: {
      comments: false
    }
  },
      callback = this.async(),
      options = Object.assign(defOpts, _loaderUtils.default.getOptions(this)),
      pubPath = this._compiler.options.output.publicPath || this._compiler.options.output.path;
  (0, _schemaUtils.default)(schemaOpts, options, 'template-pic-loader');
  var tags = new _getTags.default(options, source);
  tags.init();

  if (tags.tagsInfo.length > 0) {
    Promise.all((0, _utils.promises)(this, tags.tagsInfo)).then(function (res) {
      res.forEach(function (item) {
        var url = item.source.match(/(?<=^module\.exports[\s]=[\s])[\s\S]*/g)[0];

        if (/^__webpack_public_path__/.test(url)) {
          url = _path.default.join(pubPath, url.split(' + ')[1].slice(1, -2));
        } else url = url.slice(1, -2);

        source = source.replace(item.tag.tag, function () {
          return item.tag.tag.replace(item.tag.value, url);
        });
      });

      if (options.minimize) {
        var minimize = new _minimize.default(options.minopt);
        source = minimize.parse(source);
      }

      if (options.extract) {
        var ext = _path.default.extname(_this.resourcePath),
            name = _path.default.basename(_this.resourcePath, ext),
            filename = options.filename.replace(/\[name\]/g, name).replace(/\[ext\]/g, ext.substr(1));

        _this.emitFile(filename, source);

        callback(null, (0, _utils.response)(_this, options, source));
      } else {
        callback(null, (0, _utils.response)(_this, options, source));
      }
    }, function (err) {
      return callback(err);
    });
  } else {
    callback(null, (0, _utils.response)(this, options, source));
  }
}

;
import loaderUtils from 'loader-utils';
import path from 'path';
import validateOptions from 'schema-utils';
import getTags from './libs/get-tags';
import Minimize from 'minimize';
import { promises, response } from './libs/utils';

export default function(source) {
  let schemaOpts = {
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
  options = Object.assign(defOpts, loaderUtils.getOptions(this)),
  pubPath = this._compiler.options.output.publicPath ||
    this._compiler.options.output.path;

  validateOptions(schemaOpts, options, 'template-pic-loader');

  let tags = new getTags(options, source);
  tags.init();

  if (tags.tagsInfo.length > 0) {
    Promise.all(promises(this, tags.tagsInfo)).then(res => {
      res.forEach(item => {
        let url = item.source.match(/(?<=^module\.exports[\s]=[\s])[\s\S]*/g)[0];
  
        if (/^__webpack_public_path__/.test(url)) {
          url = path.resolve(pubPath, url.split(' + ')[1].slice(1, -2));
        } else url = url.slice(1, -2);
  
        source = source.replace(item.tag.tag, () => {
          return item.tag.tag.replace(item.tag.value, url);
        });
  
      });
  
      if (options.minimize) {
        let minimize = new Minimize(options.minopt);
        source = minimize.parse(source);
      }
  
      if (options.extract) {
        let ext = path.extname(this.resourcePath),
          name = path.basename(this.resourcePath, ext),
          filename = options.filename
            .replace(/\[name\]/g, name)
            .replace(/\[ext\]/g, ext.substr(1));
        this.emitFile(filename, source);
        callback(null, response(this, options, source));
      } else {
        callback(null, response(this, options, source));
      }
    }, err => {
      return callback(err);
    });
  } else {
    callback(null, response(this, options, source));
  }
};
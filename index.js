const path = require('path');
const mime = require('mime');
const md5 = require('md5');
const loaderUtils = require('loader-utils');

let options = {
    name: 'img.js',
    tagCondition: null,
    limit: 0
  };

let loader = function(source) {
  let callback = this.async();
  options = Object.assign(options, loaderUtils.getOptions(this), {
    alias: this._compiler.options.resolve.alias || null,
    publicPath: this._compiler.options.output.publicPath || '/static/'
  });

  this.cacheable && this.cacheable();

  if (options.tagCondition) {
    if (typeof options.tagCondition === 'string') {
      let preTags = getAllTags(options.tagCondition, source);
      if (preTags.tags.length !== 0) source = replaceContent(this, source, preTags.tags, preTags.attr);
    } else if (Array.isArray(options.tagCondition)) {
      for(let i = 0; i < options.tagCondition.length; i++) {
        let preTags = getAllTags(options.tagCondition[i], source);
        if (preTags.tags.length !== 0) source = replaceContent(this, source, preTags.tags, preTags.attr);
      }
    }
  }

  callback(null, `module.exports = ${JSON.stringify(source)}`);
}

function replaceContent(ctx, source, tags, attrName) {
  for(let i = 0; i < tags.length; i++) {
    let getAttrStrExp = new RegExp(`${attrName}\\s*=\\s*\[\\'\\"\]\[\\w\\/\\.\]*?\[\\'\\"]`, 'g'),
        repAttrValueExp = new RegExp(`${attrName}\\s*=\\s*\[\\'\\"\]`),
        attrValue = tags[i].match(getAttrStrExp)[0].replace(repAttrValueExp, '').slice(0, -1),
        alia = Object.keys(options.alias).find(aliaKey => {
          return new RegExp(`${aliaKey}\\/`).test(attrValue);
        }),
        fullUrl = attrValue.replace(alia, options.alias[alia]),
        fileSource = ctx.fs._readFileSync(fullUrl);

    source = source.replace(tags[i], function(str) {
      if (fileSource.length < options.limit) {
        return str.replace(attrValue, `data:${mime.getType(fullUrl)};base64,${fileSource.toString('base64')}`);
      } else {

        let fileExtname = path.extname(attrValue),
            fileName = path.basename(attrValue, fileExtname),
            relPath = options.name.replace(/\[name\]/g, fileName).replace(/\[ext\]/g, fileExtname.slice(1)),
            hashRegExp = /\{hash\s*\:\s*(([1-9])|([1-2][0-9])|([3][0-2]))\}/g;

        relPath = relPath[0] === '/' ? relPath.slice(1) : relPath;

        if (options.name.match(hashRegExp)) {
          relPath = relPath.replace(
            hashRegExp,
            md5(fileSource)
              .substring(md5(fileSource).length - parseInt(options.name.slice(1, -1).split(':')[1]),
              md5(fileSource).length)
            );
        }

        ctx.emitFile(relPath, fileSource);
        return str.replace(attrValue, `${path.join(options.publicPath, relPath).split(path.sep).join('/')}`);
      }
    });
  }

  return source;
}

// Get all tags that conform to the tagModule condition
function getAllTags(conditions, source) {
  let conditionArray = conditions.split('?').length > 1
    ? [conditions.split('?')[0], conditions.split('?')[1].split(':')[0], conditions.split('?')[1].split(':')[1]]
    : [conditions.split(':')[0], conditions.split(':')[1]],

    conRegExp = new RegExp(`\\<${conditionArray[0]}\[\\s\\S\]*?\\/?\\>`,'g'),
    conTags = source.match(conRegExp) || [],
    tmpFullTags = [];

  if (conditionArray.length === 3) {
    let hasAttrRegExp = new RegExp(`${conditionArray[1].split('=')[0]}\\s*=\\s*\[\\'\\"\]\[\\s\\S\]*?\[\\'\\"\]`, 'g');

    tmpFullTags = conTags.filter(tag => {
      return tag.match(hasAttrRegExp)[0].replace(new RegExp(`rel\\s*=\\s*\[\\'\\"\]`,'g'),'').slice(0, -1).split(/\s+/g)
        .filter(attr => {
          return attr === conditionArray[1].split('=')[1];
        }).length > 0;
    });

  } else {
    tmpFullTags = conTags;
  }

  return {
    attr: conditionArray[conditionArray.length - 1],
    tags: tmpFullTags
  };
}

module.exports = loader;

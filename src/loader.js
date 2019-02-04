import loaderUtils from 'loader-utils';
import path from 'path';
import validator from './libs/validator';
import getTags from './libs/get-tags';
import promises from './libs/promises';

export default function(source) {
  let defaultOpts = {
    self: false,
    condition: null
  }, 
  options = Object.assign(defaultOpts, loaderUtils.getOptions(this));

  validator(options);
  let tags = getTags(options, source);

  if (!options.self) {
    Promise.all(promises(this, tags)).then(res => {
      console.log(111111, res);
    }, err => {
      console.log('ERROR::::', err);
    })
  }

  return source;
};
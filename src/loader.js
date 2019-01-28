import loaderUtils from 'loader-utils';
import path from 'path';
import validator from './libs/validator';
import getTags from './libs/get-tags';

export default function(source) {
  let defaultOpts = {
    self: false,
    condition: null
  }, 
  options = Object.assign(defaultOpts, loaderUtils.getOptions(this));

  validator(options);

  getTags(options)

  if (!options.self) {
    
  }

  return source;
};
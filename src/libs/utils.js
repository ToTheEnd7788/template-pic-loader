const promises = (ctx, tags) => {
  let pros = tags.reduce((acc, tag) => {
    acc.push(
      new Promise((res, rej) => {
        ctx.loadModule(tag.value, (err, source) => {
          if (err) rej(err);
          res({
            source,
            tag
          });
        })
      })
    );

    return acc;
  }, []);

  return pros;
},

  response = ({ loaders, loaderIndex: index }, { extract, minimize }, source) => {
    let result;

    if (extract) {
      result = '// Extracted by 「template-pic-loader」'
    } else {
      // Is Last Loader Or Not
      if (index < (loaders.length - 1)) result = source;
      else result = `export default ${JSON.stringify(source)}`;
    }

    return result;
  };

export {
  promises,
  response
};
  

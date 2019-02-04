export default (ctx, tags) => {
  let pros = tags.reduce((acc, item) => {
    acc.push(
      new Promise((res, rej) => {
        ctx.loadModule(item.value, (err, source, sourceMap, module) => {
          if (err) rej(err);
          res({
            source,
            sourceMap,
            module
          });
        })
      })
    );

    return acc;
  }, []);

  return pros;
}
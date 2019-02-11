export default (ctx, tags) => {
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
}
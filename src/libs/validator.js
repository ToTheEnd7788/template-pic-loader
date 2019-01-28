export default (opts) => {
  let optList = ['self', 'condition', 'name', 'limit'];

  // Check all opts key
  for (let i = 0; i < Object.keys(opts).length; i++) {
    if (optList.indexOf(Object.keys(opts)[i]) === -1) {
      throw new RangeError(
        `template-pic-loader:
  get a useless options named [${Object.keys(opts)[i]}],
  Must be one of them ${JSON.stringify(optList)}
      `)
    }
  }

  // If self is true, Don't allowed set name or limmit
  if (!opts['self']) {
    for (let i = 0; Object.keys(opts).length; i++) {
      if (['name', 'limit'].indexOf(Object.keys(opts)[i]) > -1) {
        throw new RangeError(
          `template-pic-loader:
  when [self] is true,
  don't allowed set [name] or [limit]`
        );
      }
    }
  }
}
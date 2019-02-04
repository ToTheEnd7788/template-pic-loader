export default (opts, source) => {
  let conditions = opts.condition,
    tagsInfo = [];

  tagsInfo = conditions.reduce((acc, item) => {
    let conArray = item.split(':'),
      attrName = conArray[1],
      tagName = conArray[0].split('?')[0],
      signAttr = conArray[0].split('?')[1] || '',
      signName = signAttr ? signAttr.split('=')[0] : '',
      signVal = signAttr ? signAttr.split('=')[1] : '',
      signExtra = signName && signVal ? `${signName}=\"[\\s\\S]*${signVal}[\\s\\S]*` : '';

    let tags = source.match(new RegExp(`<[\\s]*${tagName}[\\s\\S]*${signExtra}?\"[\\/]?>`, 'g'));

    let reg = new RegExp(`(?<=${attrName}[\\s]?=[\\s]?[\\"\\']).*?(?=[\\"\\'])`, 'g');

    tags.forEach(tagStr => {
      acc.push({
        tag: tagStr,
        value: tagStr.match(reg) ? tagStr.match(reg)[0] : ''
      });
    });

    return acc;
  }, []);

  return tagsInfo;
}
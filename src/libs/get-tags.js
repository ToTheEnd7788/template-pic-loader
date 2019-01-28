export default (opts, source) => {
  let conditions = opts.conditions,
    tagsInfo = [];

  // link
  /<[\s]*link[\s\S]*rel=\"[\s\S]*icon[\s\S]*?\"[\/]?>/g
  tagsInfo = conditions.reduce((acc, item) => {
    let conArray = item.split(':'),
      attrName = conArray[1],
      tagName = conArray[0].split('?')[0],
      signAttr = conArray[0].split('?')[1] || '',
      signName = signAttr ? signAttr.split('=')[0] : '',
      signVal = signAttr ? signAttr.split('=')[1] : '',
      signExtra = signName && signVal ? `${signName}=\"[\s\S]*$signVal[\s\S]*` : '';

    let reg =
      new RegExp(`<[\\s]*${tagName}[\\s\\S]*${signExtra}?\"[\\/]?>`, 'g');

    console.log(1111,reg);

  });
}
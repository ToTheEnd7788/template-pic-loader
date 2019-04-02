class GetTags {
  constructor(opts, source) {
    this.condition = opts.condition;
    this.source = source;
    this.tagMap;
    this.tagsInfo;
  }

  init() {
    if (this.condition) {
      this.cleanSource();
      this.tagMap = this.buildTagMap();
      this.updateTagsInfo();
    }
  }

  // Ignore Conmments And Delete Module/Export Beginner 
  cleanSource() {
    this.source = this.source.trim()
      .replace(/^(export[\s]default)|(module.exports[\s]=)[\s]+/, '')
      .replace(/<!--[\S\s]*?-->/g, '');
  }

  // Build Target Tag map
  buildTagMap() {
    return this.condition.reduce((acc, item) => {
      let baseList = item.split(':'),
        sepList = baseList[0].trim().split('?'),
        signAttrs = null;

      if (sepList.length > 1) {
        let signList = sepList[1].trim().split('&');

        signAttrs = signList.reduce((fresh, sStr) => {
          let keyVList = sStr.trim().split('=');
          if (
            keyVList.length === 2 &&
            keyVList[1].trim() !== ''
          ) {
            fresh.push({
              sName: keyVList[0].trim(),
              sValue: keyVList[1].trim()
            });
          }

          return fresh;
        }, []);
      }

      acc.push({
        tName: sepList[0],
        signAttrs,
        attr: baseList[1].trim()
      });

      return acc;
    }, []);
  }

  // Update 'tagMap' Based On tName
  updateTagsInfo() {
    this.tagsInfo = this.tagMap.reduce((acc, item) => {
      let allTags = this.source
        .match(new RegExp(`<${item.tName}[\\s\\S]*?[\\s]*[\\/]?>`, 'g')),
        tags = allTags || [];

      if (item.signAttrs) {
        let signExpStr = '';
        signExpStr = item.signAttrs.reduce((str, sign) => {
          str = signExpStr + `(?<=${sign.sName}[\\s]?=[\\s]?['"][\\s\\S]*${sign.sValue}[\\s\\S]*['"])`;
          return str;
        }, '');

        tags = allTags.filter(tag => {
          return new RegExp(signExpStr, '').test(tag);
        });
      }

      for (let tag of tags) {
        let tempVal = tag
          .match(new RegExp(`(?<=${item.attr}[\s]*=[\s]*['"])[^'"]+(?=['"])`, 'g'));
        if (tempVal && tempVal[0]) {
          acc.push({
            tag,
            value: tempVal[0]
          });
        }
      }

      return acc;
    }, []);
  }
}

export default GetTags;
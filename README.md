#FEATURE
1. solve the template like hbs, for *Webpack* ,
2. Solve the pictures source request in up-template which request like tags named 'img' or 'link?rel=shorcut icon' *, for *Webpack* 

#Todos
Use ES6+ to rebuild the loader

#HOW TO USE
Like **url-loader** , you should use it like: ↓   

1. **In template**
```
< link rel="shortcut icon" href="" >
< img src="__imgs/4.jpg" >
...
```
2. **In webpack.config.js**

```javascript
rules: [
    ...,
    {
    test: /\.hbs$/,
    exclude: /node_modules/,
    use: extractHbs.extract({
      loader: 'template-pic',
      options: {
        name: 'imgs/[name]~{hash:9}.[ext]',
        tagCondition: ['link?rel=icon:href', 'img:src'],
        limit: 30000
      }
    })
  },
    ...
]
```
**name** : String  
plan to ouput  file information  

**tagCondition** String|Array  
Tell loader which tags and tag's attr need to bundle, if only one tag, you'd better use **String** , if multiple choosees,please use a **Array**. For details, please check up-demo.

**limit**: Number(int)  
If the picture source size less than limit, loader will translate source to base64, and fix emit file request url, or fix request url in tags directly.

#Tips
1. Must have resolve.alias in webpack.config, and use it, like '__imgs/......'
2. Hot reload did't support so far
3. the hashValue is from md5 rules

##version logs
1. v1.1.0 : Begin to add Readme, and this is the test version
2. v1.1.2 : Add Readme files
3. v1.1.3 : update the package.json, and push code to github respository
4. v1.1.4: fixed structure of project files positions
5. v1.1.6: fixed md file

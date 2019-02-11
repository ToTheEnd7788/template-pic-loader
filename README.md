### FEATURE
1. solve the template link source like hbs, html, with **Webpack** ,
2. Solve the like pictures source request in up-template which request like tags named 'img' or 'link?rel=shorcut icon', for **Webpack**
3. It depends on **url-loader**

#### TODO
Support hash

### HOW TO USE 
#### **Template**
```
< link rel="shortcut icon" href="xxxxxx" >
< img src="__imgs/4.jpg" >
...
```
#### **Webpack Config**

```javascript
rules: [
    ...,
    {
    test: /\.hbs$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'template-pic-loader',
        options: {
          condition: [ 'link?rel=icon:href', 'img:src' ],
          extract: true,
          filename: '[name].[ext]',
          minimize: true
        }
      }
    ]
  },
    ...
]
```
#### Options
  **filename** : String  
  Output file information.

  **condition** Array  
  Tell loader which tags and tag's attr need to bundle,For details, please check up-demo.

  **extract**: Boolean
  Extract source based on filename or not.

  **minimize**: Boolean
  Minimize the source or not.

  **minopt**: Object
  Work when **minimize** is true, like [**minimize package options**](https://www.npmjs.com/package/minimize), you can check it.

***If this small package is helpful in your applications please give it a start, THANKS!!!***

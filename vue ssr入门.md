# vue ssr入门

## 前言

近期需要接手一个vue ssr项目，由于本人之前没有写过ssr，只是稍微了解了点。所以跟着官网学了下，并整理出了这篇学习笔记。方便自己以后对vue ssr知识的回顾。好记性不如烂笔头。



## 介绍

相信大家在看到这篇文章之前，都知道ssr是什么了。SSR，英文全称叫 Server(服务) side(端) rendering (渲染)哈哈☺

那么究竟什么是服务器端渲染？

>  Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

>  服务器渲染的 Vue.js 应用程序也可以被认为是"同构"或"通用"，因为应用程序的大部分代码都可以在**服务器**和**客户端**上运行。

如果你问我为什么使用ssr呢？([具体可参考官网](<https://ssr.vuejs.org/zh/#%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%BF%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%B8%B2%E6%9F%93-ssr-%EF%BC%9F>))

> - 有利于seo。
> - 更快的内容到达时间 (time-to-content),特别是对于缓慢的网络情况或运行缓慢的设备。大体可以理解为渲染出页面时间，csr比ssr多了个js下载时间。因为ssr一开始加载下来就渲染出来了，然后在下载激活html的js。csr是下载完在渲染。



## 正文

### 基本用法

ssr主要依靠两个包`vue-server-renderer`和 `vue`(两个版本必须匹配)

安装: `npm install vue vue-server-renderer --save`



#### 入门配置

##### ssr雏形

```javascript
// server.js
const server = require('express')()
const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer();

server.get('*', (req, res) => {
    const context = {
        url: req.url
    }
    const app = new Vue({
        template: `<div>${context.url}</div>`
    })
    renderer.renderToString(app, (err, html) => {
        if (err) {
            res.status(500).end('Internal Server Error')
            return
        }
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head><title>Hello</title></head>
            <body>${html}</body>
            </html>
        `)
    })
})

server.listen(8080)
```



`node server.js` 浏览器输入localhost:8080访问该ssr页面

这时候你可以看到，无论你输入什么路径，页面文本都会显示出你的路径![image-20190409014053501](/Users/zhouatie/Library/Application Support/typora-user-images/image-20190409014053501.png)

##### ssr初长成(使用模板)

当你在渲染 Vue 应用程序时，renderer 只从应用程序生成 HTML 标记 (markup)。在这个示例中，我们必须用一个额外的 HTML 页面包裹容器，来包裹生成的 HTML 标记。纯客户端渲染的时候，会有一个模板，会插入你打包后的一些文件等。那么ssr会不会也有这种模板呢？当然会有。

- 首先在根目录下新建一个`index.template.html`文件

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head><title>Hello</title></head>
    <body>
      <!--vue-ssr-outlet-->
    </body>
  </html>
  ```

  注意了 --跟vue或者outlet跟--之间不能用空格。注释 -- 这里将是应用程序 HTML 标记注入的地方。

- 接下来，修改下刚才的server.js文件后如下

  ```javascript
  const server = require('express')()
  const Vue = require('vue');
  const renderer = require('vue-server-renderer').createRenderer({
      template: require('fs').readFileSync('./index.template.html', 'utf-8')
  });
  server.get('*', (req, res) => {
      const context = {
          url: req.url
      }
      const app = new Vue({
          template: `<div>${context.url}</div>`
      })
      renderer.renderToString(app, (err, html) => {
          if (err) {
              res.status(500).end('Internal Server Error')
              return
          }
          res.end(html)
      })
  })
  
  server.listen(8080)
  ```

  就是在createRenderer中多加一个参数 template(读取模板文件)，并传递给createRenderer方法

  模板还支持插值

  ```html
  <html>
    <head>
      <!-- 使用双花括号(double-mustache)进行 HTML 转义插值(HTML-escaped interpolation) -->
      <title>{{ title }}</title>
  
      <!-- 使用三花括号(triple-mustache)进行 HTML 不转义插值(non-HTML-escaped interpolation) -->
      {{{ meta }}}
    </head>
    <body>
      <!--vue-ssr-outlet-->
    </body>
  </html>
  ```

  我们可以通过传入一个"渲染上下文对象"，作为 `renderToString` 函数的第二个参数，来提供插值数据：

  ```javascript
  const context = {
    title: 'hello',
    meta: `
      <meta ...>
      <meta ...>
    `
  }
  
  renderer.renderToString(app, context, (err, html) => {
    // 页面 title 将会是 "Hello"
    // meta 标签也会注入
  })
  ```

  

  





## 参考

[Vue SSR 指南](<https://ssr.vuejs.org/zh/>)

[vue 服务端渲染ssr](<https://www.jianshu.com/p/a7631293d7f1>)

[带你五步学会Vue SSR](<https://segmentfault.com/a/1190000016637877#articleHeader0>)
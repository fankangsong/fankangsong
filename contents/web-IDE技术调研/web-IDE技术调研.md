# web IDE 技术调研

* [阿里开源OpenSumi](https://opensumi.com/zh)
* [Eclipse Theia](https://theia-ide.org/)

框架相关参考：

* [Eclipse Theia 框架技术架构揭秘](https://zhaomenghuan.js.org/blog/theia-tech-architecture.html)
* [定制化IDE选型笔记](http://www.ayqy.net/blog/%E5%AE%9A%E5%88%B6%E5%8C%96ide%E9%80%89%E5%9E%8B%E7%AC%94%E8%AE%B0/)
* [Eclipse Theia学习（三）：Theia的启动流程是什么？前后端插件子进程到底有几个？](https://juejin.cn/post/7025823866878427173)
* [Eclipse Theia 揭秘之启动流程篇](https://blog.csdn.net/lannister_awalys_pay/article/details/117529970)
* [codesandbox 私有化](https://github.com/mcuking/blog/issues/86)


## opensumi

计划使用 opensumi 来构建一个 web IDE 环境，集成到 Electron 应用中，实践过程发现前端代码是可以打包独立部署的，但是 opensumi-startup 提供的服务端，进行 webpack 打包会排除 `node_modules` 目录，这种打包独立部署起来，必须先安装依赖，打包的意义不大。我想解决的是，node 服务打包成单文件，并且包括了相关依赖，在任何有 node 环境的地方启动端口就能工作。

* [使用 Webpack 打包 node 程序，node_modules 真的被干掉啦](https://juejin.cn/post/7158276098776629262)

## 其他思路

* [Add .vue files as a supported language #1204](https://github.com/microsoft/monaco-editor/issues/1204)
* [https://github.com/Kingwl/monaco-volar](https://github.com/Kingwl/monaco-volar)
* [Volar (Fast Vue Language Support) extension for coc.nvim](https://github.com/yaegassy/coc-volar)
* [volar: Explore high-performance tooling for Vue](https://github.com/johnsoncodehk/volar)
* [https://github.com/johnsoncodehk/volar/discussions/598](https://github.com/johnsoncodehk/volar/discussions/598)
* [https://stackoverflow.com/questions/71196848/how-to-connect-volar-to-monaco-editor](https://stackoverflow.com/questions/71196848/how-to-connect-volar-to-monaco-editor)
* [Monaco/web worker support](https://github.com/johnsoncodehk/volar/discussions/598)

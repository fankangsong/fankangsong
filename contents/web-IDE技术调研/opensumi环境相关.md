## Electron 版本与 node 版本的支持列表

使用不同的 Electron 要安装对应的 node 版本 https://www.electronjs.org/docs/latest/tutorial/electron-timelines#timeline

## node-gyp 与 node 版本的关系

如果修改了 node 版本，执行：

```shell
node-gyp clean
node-gyp install
```

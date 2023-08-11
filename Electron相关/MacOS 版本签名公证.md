
electron-builder 修复 user-defined binaries 的问题：
https://github.com/electron-userland/electron-builder/pull/6660

Eelectron 应用内依赖 jar 文件，进行公证报错的问题：
https://github.com/electron-userland/electron-builder/issues/7000

# 解决 electron-buider 打包 Mac，内置 jar 包无法公证的问题

## 问题
上周上线了 Electron 应用的 Mac 版，发布后用户反馈打开应用提示包含恶意软件，这才发现发布后忘记进行 DMG 文件的公证，于是赶紧基于已发布的安装包文件进行公证，然后 Apple 返回类似错误（错误信息引用自https://github.com/electron/osx-sign/issues/229，内容类似，错误码相同）：

```json
{
  "logFormatVersion": 1,
  "jobId": "****",
  "status": "Invalid",
  "statusSummary": "Archive contains critical validation errors",
  "statusCode": 4000,
  "archiveFilename": "myapp.zip",
  "uploadDate": "****",
  "sha256": "****",
  "ticketContents": null,
  "issues": [
    {
      "severity": "error",
      "code": null,
      "path": "myapp.zip/myapp.app/Contents/Resources/app.asar.unpacked/node_modules/elasticsearch/lib/jna-4.5.1.jar/com/sun/jna/darwin/libjnidispatch.jnilib",
      "message": "The binary is not signed.",
      "docUrl": null,
      "architecture": "i386"
    },
    {
      "severity": "error",
      "code": null,
      "path": "myapp.zip/myapp.app/Contents/Resources/app.asar.unpacked/node_modules/elasticsearch/lib/jna-4.5.1.jar/com/sun/jna/darwin/libjnidispatch.jnilib",
      "message": "The signature does not include a secure timestamp.",
      "docUrl": null,
      "architecture": "i386"
    },
    {
      "severity": "error",
      "code": null,
      "path": "myapp.zip/myapp.app/Contents/Resources/app.asar.unpacked/node_modules/elasticsearch/lib/jna-4.5.1.jar/com/sun/jna/darwin/libjnidispatch.jnilib",
      "message": "The binary is not signed.",
      "docUrl": null,
      "architecture": "x86_64"
    },
    {
      "severity": "error",
      "code": null,
      "path": "myapp.zip/myapp.app/Contents/Resources/app.asar.unpacked/node_modules/elasticsearch/lib/jna-4.5.1.jar/com/sun/jna/darwin/libjnidispatch.jnilib",
      "message": "The signature does not include a secure timestamp.",
      "docUrl": null,
      "architecture": "x86_64"
    },
    {
      "severity": "error",
      "code": null,
      "path": "myapp.zip/myapp.app/Contents/Resources/app.asar.unpacked/node_modules/elasticsearch/lib/jna-4.5.1.jar/com/sun/jna/darwin/libjnidispatch.jnilib",
      "message": "The binary is not signed.",
      "docUrl": null,
      "architecture": "x86_64h"
    },
    {
      "severity": "error",
      "code": null,
      "path": "myapp.zip/myapp.app/Contents/Resources/app.asar.unpacked/node_modules/elasticsearch/lib/jna-4.5.1.jar/com/sun/jna/darwin/libjnidispatch.jnilib",
      "message": "The signature does not include a secure timestamp.",
      "docUrl": null,
      "architecture": "x86_64h"
    }
  ]
}
```

## 分析公证失败的错误

根据以上错误信息，首先我着手解决应用包内这几个二进制文件的签名，我们发布的应用时基于 electron-builder 打包的，语法发现文档（https://www.electron.build/configuration/mac）有一个字段可以对特定二进制文件进行签名：

	`binaries`: Array<String> | “undefined” - Paths of any extra binaries that need to be signed.

接下来我修改了这个字段，并对文件一一进行尝试签名，然后编译过程就报错了，遇到了这个已知问题https://github.com/electron-userland/electron-builder/pull/6660，通过 issue 的描述，发现我们使用的 `electron-builder` 版本没有修复这个问题，于是再升级到最新版本。

把 `electron-builder` 升级后，发现真的 `.jar` 文件签名可以成功，但是公证仍然报错，公证后报错原因依旧，再仔细分析报错发现，Apple 服务进行文件公证，会读取 `.jar` 内部文件，而 Electron-builder 无法针对 `.jar` 包内部文件签名。

一筹莫展……

## 继续找答案

通过 Google 查到这个 issue：https://github.com/electron/osx-sign/issues/229

大致思路是：

1. 解压 `.jar` 文件，得到解压后的文件
2. 使用 `codesign` 命令依次对需要签名的二进制文件签名
3. 完成签名后，重新把解压后的文件打包进 `.jar` 文件
4. 针对 `.jar` 文件，使用 `codesign` 命令签名
5. 打包 DMG 文件，对 DMG 文件签名
6. 公证

实践下来，公证成功，重新启动我们的客户端，不会再提示恶意软件的错误了。

于是我写了一个 `shell` 脚本，在每次公证前先执行签名：

```shell
# 设置变量以便重复使用

temp_dir="resources/bin/apache-maven-3.9.3/lib/.temp"

jansi_jar="resources/bin/apache-maven-3.9.3/lib/jansi-2.4.0.jar"

codesign_options="--sign {xxxxxx} --force --keychain /var/folders/g9/xxx.keychain --timestamp --options runtime --entitlements macos/entitlements.mac.plist"

  

# 创建临时目录
mkdir -p "$temp_dir"

# 复制 jansi-2.4.0.jar 到临时目录
cp "$jansi_jar" "$temp_dir/"

# 解压 jansi-2.4.0.jar
unzip "$temp_dir/jansi-2.4.0.jar" -d "$temp_dir"、

# 对 jansi.jnilib 文件进行签名

for file in "$temp_dir/org/fusesource/jansi/internal/native/Mac/"*.jnilib; do
  codesign $codesign_options "$file"
done


# 压缩更新临时目录中的文件到 jansi-2.4.0.jar
zip -r -u "$temp_dir/jansi-2.4.0.jar" "$temp_dir/org" "$temp_dir/META-INF"


# 对更新后的 jansi-2.4.0.jar 进行签名
codesign $codesign_options "$temp_dir/jansi-2.4.0.jar"

# 将更新后的 jansi-2.4.0.jar 复制到目标目录
cp "$temp_dir/jansi-2.4.0.jar" "resources/bin/apache-maven-3.9.3/lib/"

# 清理临时目录

rm -rf "$temp_dir"
```
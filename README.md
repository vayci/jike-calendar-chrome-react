





# 📆 即刻黄历Chrome Extension 

## 概述

基于React的即刻黄历Chrome Extension。

在您的Chrome上查看即刻黄历，采用Web扫码登录，数据与App端同步。



![](https://github.com/vayci/jike-calendar-chrome-react/blob/master/readme/jike-chrome.png)





## 背景

继室友[Dawninest](https://github.com/Dawninest)开发了即刻黄历的[macOS DOCK版](https://github.com/Dawninest/jikeCalendar-macOS-dock)之后，本 ~~Windows系统忠实使用者~~ 买不起Mac的穷人表示不服。立志做一款Windows能够使用的即刻黄历。

但是使用C#去写一个黄历.exe 感觉 ~~功能太简单~~ 自己水平不是很足够，写起来很慢。

还不如写一个Chrome扩展，还能跨系统通用，于是诞生此项目。



## 编译

1.设置环境变量 INLINE_RUNTIME_CHUNK=false ，如Windows下

>  set INLINE_RUNTIME_CHUNK=false 



2.Build

> yarn build

输出目录默认为build，目录下的输出文件为chrome extension源文件，可直接打开Chrome浏览器开发者模式采用目录加载的方式进行加载（不建议此方式使用本扩展，插件正在努力上架Chrome网上商店中...）



## 其他

如果你是一名Web开发者，当你看到项目代码时请尽情吐槽，只要不告诉我就行。

毕竟后端Java工程师写出来的前端代码就是这么毫无美感



![](https://github.com/vayci/jike-calendar-chrome-react/blob/master/readme/slogan.png)


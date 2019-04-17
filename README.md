





# 📆 即刻黄历Chrome Extension 



## 概述

基于React的即刻黄历Chrome Extension。

在您的Chrome上查看即刻黄历，采用Web扫码登录，数据与App端同步。



![](https://github.com/vayci/jike-calendar-chrome-react/blob/master/readme/jike-chrome.png)

## 背景

继室友[Dawninest](https://github.com/Dawninest)开发了即刻黄历的[macOS DOCK版](https://github.com/Dawninest/jikeCalendar-macOS-dock)之后，本 ~~Windows系统忠实使用者~~ 买不起Mac的穷人表示不服。立志做一款Windows能够使用的即刻黄历。

但是使用C#去写一个黄历.exe 感觉 ~~功能太简单~~ 自己水平不是很足够，写起来很慢。

还不如写一个Chrome扩展，还能跨系统通用，于是诞生此项目。



## 下载

### 商店安装(推荐)

扩展Chrome网上应用店链接: [即刻黄历](https://chrome.google.com/webstore/detail/%E5%8D%B3%E5%88%BB%E9%BB%84%E5%8E%86/mchjdojlonajklbdifjmmjmekkgmgbmd)



### 本地安装
如果没有梯子，无法打开Chrome应用商店，则可以打开Chrome浏览器开发者模式，采用目录加载的方式进行加载使用。

1. 下载[Chrome Extension源码](https://github.com/vayci/jike-calendar-chrome-react/releases/download/V1.0.0/jike-calendar.zip)

2. 解压源码

3. 打开Chrome开发者模式（浏览器地址栏输入chrome://extensions/直达）

4. 加载源码解压目录（加载已解压的扩展程序）



## 编译

1.Install

> yarn install


2.设置环境变量 INLINE_RUNTIME_CHUNK=false ，如Windows下

>  set INLINE_RUNTIME_CHUNK=false 



3.Build

> yarn build

输出目录默认为build，目录下的输出文件为chrome extension源文件



## 其他

如果你是一名Web开发者，当你看到项目代码时请尽情吐槽，只要不告诉我就行。

毕竟后端Java工程师写出来的前端代码就是这么毫无美感

💗 即刻ID：GIF倒放怪



![](https://github.com/vayci/jike-calendar-chrome-react/blob/master/readme/slogan.png)


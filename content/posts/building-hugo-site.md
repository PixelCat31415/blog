---
title: 建立 Hugo Site
description: 也就是這個 blog owo
toc: true
authors: []
tags: [web, hugo]
categories: []
series: []
date: 2022-07-19T16:44:54+08:00
lastmod: 2022-07-19T16:44:54+08:00
featuredVideo:
featuredImage:
draft: false
---

花了兩天才把這個 blog 架起來，來紀錄一下我都浪費了多少時間（？）在搞各種奇怪的東西。

## 為什麼我要做這件事

架這個網站其實說不上是一件多有效益的事情，畢竟架了站對寫程式實在沒什麼幫助，又花時間，可能也沒多少人看。不過，我還是想做做看，因為有時候學到有趣的東西、寫到酷酷的題目還是會想要找個地方寫下來，當成是自己都在做什麼的一個紀錄。之前我是在 instagram 上發一些短文，偶爾配幾張圖片，可是後來慢慢會想寫一些篇幅長一點的東西，以 instagram 作為載體變得不是那麼適合，又剛好遇到暑假什麼事都沒有的空檔，就做下去了。

TL;DR：我想而且我閒，ㄎㄎ。

## 如何架站

因為我顯然沒錢自己搞一台伺服器再搞一個域名，所以我盯上 GitHub 提供的 GitHub Pages，可以寄存靜態網站。缺點是只能放靜態網站，不過我沒差，我看起來像會寫 / 需要寫後端嗎 owo

另外，我不可能自己寫一個 CMS[^1]，又想有能力自己把網站捏成喜歡的樣子，所以我用 [Hugo] 幫我產生網頁。文章內容本身是用 Markdown 寫的，經過 Hugo 一番操作變成靜態網頁，最強大的是可以自己寫（或偷別人的）很多模板，根據模板產生網頁 HTML，所以看哪裡不順眼就可以自己去改模板，足夠靈活，目前沒遇到什麼大問題。

## Hugo

### 安裝

不怎麼特別，照著官網複製貼上就好了，目前還沒載到病毒（？）

### 找主題

這個真的是難，因為現成主題（theme）幾百個，但是要找到看順眼的、載下來符合預期、有提供充足個人化自由度的不知道有沒有幾個。因為實在太多了所以隨便選了一個看起來算順眼的，反正可以自己改，最後使用的是 [Eureka](https://github.com/wangchucheng/hugo-eureka)。

> Eureka is a feature-rich and highly customizable Hugo theme. Using Eureka allows you to customize and deploy your website quickly and easily.

highly customizable...？你個鬼啦，接下來就是無盡 customize 了。

### 自訂主題

主題都會有給好的選項可以調，不過效果有限，最直接的方法還是直接改裡面的模板。然而此時發現Hugo 檔案根本量子糾纏，先不檢討我沒認真把官方文件看完（真的太多了啦 QQ），但是這到底是啥鬼（圖裡大概只有不到三分之一的檔案吧）

![eureka files screenshot]({{< img "Screenshot_20220719_172953.png" >}})

原來是這個主題超級肥，有各種酷酷的功能，導致檔案一大堆難以找出到底要改哪個，好在經過一番通靈和撞牆還算搞懂哪個檔案在做什麼了。其實這步應該是最難的，因為搞懂了剩下都是 HTML/CSS 可以搞定的事情，慢慢搞就能做出想要的樣子了。

需要改動的檔案主要是 layout 裡面的模板，每個模板都對應到頁面的某些部份，所以看哪裡不順眼就去改對應的模板，可以改內容也可以加個 CSS 改排版顏色之類的。最後被我改過的東西有：

1. 背景顏色，從純黑改成 Monikai 的背景色，這是主題自帶的選項之一。
2. Markdown 樣式，包括前面黃色的井字號、看不太出來的縮排之類的，用一個自己給的 CSS 完成。<br>
   因為 CSS 是我自己亂搞的，所以發現哪裡劇醜或者排版在移動端炸了算正常（X）
3. Markdown 程式碼著色，順便加上行號，這是 Hugo 自帶的選項。
4. 用自己的 CSS 把一切顏色都改成 Monokai 配色，好耶
5. 其他的好像不太重要

中間的小插曲是我怎麼改背景色都沒有用，搞超級久才發現他的 CSS 是預處理過快取起來的，預設強制用快取的檔案，所以怎麼改原始檔案都沒用，不過官方文件完全沒提到這件事，嚴重差評。

## GitHub Pages

搞定 Hugo 就可以本地建立靜態網頁檔案了，可以推到 GitHub Pages 上。GitHub Pages 使用還蠻好上手的，只要蓋一個 repo 直接可以有可以用的網站。不過這樣要先本地跑過 hugo 才能推上去，而且原始檔案和處理好的網頁要分成兩個 repo 太麻煩了，於是官網給了一種解決方案，用 [GitHub Action](https://gohugo.io/hosting-and-deployment/hosting-on-github/#build-hugo-with-github-action) 做到每次 push 東西上去都幫你跑一次 hugo，這樣完全不需要在本地建置整個網站。

可能踩到小小的雷是，因為 GitHub Action 不是在自己的機器上跑，所以只要什麼設定沒改好或是 Hugo 版本沒有指定好（我就踩到這個）就會開噴一坨奇怪的錯誤，有時候還真不知道要從何解決起。

## 未完的工作

最後網站架好了，完全沒花半塊錢，賺翻吧。但是基本上他現在根本就是空殼，沒幾篇文，還是要靠之後繼續產出其他有用的東西。至少希望不要過好幾年了，文章數還是兩隻手數的出來 -w-

不過搞不好我過一個月就遺忘這個網站了，誰知道 wwww

[^1]: Content Management System，不是你想的那個 Contest Management System

[hugo]: https://gohugo.io/

<!--
1. hugo
   1. install
   2. directory structure
   3. theme config (eureka)
      1. reading & understanding fucking messy code
      2. custom color
         1. npm packages -> rebuild css
      3. custom scss
2. github page
   1. set up repo
   2. github action for deployment
      1. hugo version
-->

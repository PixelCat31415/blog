---
title: 筆記．競程向 vimrc
description:
toc: true
authors: []
tags: [競程, 筆記]
categories: []
series: []
date: 2022-08-13T00:30:47+08:00
lastmod: 2022-08-13T00:30:47+08:00
featuredVideo:
featuredImage:
draft: false
---

據說會用 vim 是大學 ICPC 選手的基礎技能，而且 vim 又難又難，趁早學絕對不虧，高中 TOI 之類的競賽基本上也有 vim 可以用。vim 雖然一開始不太習慣，但是用多了之後寫程式的速度也能達到跟其他編輯器（我自己最喜歡的是 vscode）差沒有太多。

稍微整理一下我的 vimrc，因為是設想賽中使用，為了方便背起來還要夠快打完所以壓了長度、省略了不必要的設定之類的。

## vimrc

```vimrc
" ~/.vimrc
sy on
set ru nu rnu cul cin et bs=2 ls=2 so=8 sw=4 sts=4 mouse=a

inoremap ( ()<Esc>i
inoremap [ []<Esc>i
inoremap " ""<Esc>i
inoremap ' ''<Esc>i
inoremap {<CR> {<CR>}<Esc>O

noremap <F9> <Esc>:w<CR>:!echo Compiling...; g++ "%:p" -o "%:p:r".out -std=c++14 -DLOCAL -O2 -Wall -Wextra -Wshadow -Wconversion -fsanitize=address -fsanitize=undefined; echo Finished<CR>
noremap <F10> <Esc>:!echo Running...; "%:p:r".out; echo Finished<CR>
map <F11> <F9><F10>
```

## 一些註釋

- 第 2 行：語法 highlight
- 第 3 行：各種設定（詳細請左轉[文件][option-list]）
- 第 5~9 行：括號、引號補完，我已經被現代編輯器寵壞了 QQ
- 第 11~13 行：F9 編譯、F10 執行、F11 編譯並執行。這是我從一開始 Dev-C++ 一直留下來的習慣（？
- 編譯指令全部在第 11 行
- 編譯執行的指令多 echo 一些訊息的原因是，我覺得知道他現在在做什麼還蠻有用的，不過完全不必要

## References

- [Option List - Vim Documentation][option-list]

[option-list]: http://vimdoc.sourceforge.net/htmldoc/quickref.html#option-list

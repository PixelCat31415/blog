---
title: 筆記．g++ 編譯選項
description: 各種常用的 g++ 選項
toc: true
authors: []
tags: [筆記, C++]
categories: []
series: []
date: 2022-07-27T21:33:50+08:00
lastmod: 2022-07-27T21:33:50+08:00
featuredVideo:
featuredImage:
draft: false
---

有些好用的 g++ 編譯選項每次都看過就忘了，寫下來當作以後的 reference。

## 基本指令

```bash
g++ [options] file...
```

file 可以有很多個，`.cpp` 或 `.o` 也都可以。

## 選項

### 一般

- `-o file`<br>
  指定輸出檔名為 `file`
- `-std=c++xx`<br>
  指定 c++ 語法版本為 `xx`
- `-D XXX` `-DXXX`<br>
  等於加上 `#define XXX`，空格可有可無

### 編譯

- `-E`<br>
  進行預處理，輸出預處理結果。不指定輸出檔名的話直接輸出到 stdout
- `-S`<br>
  進行預處理和編譯，輸出組合語言檔 `.s`
- `-c`<br>
  編譯但不連結，輸出目的檔 `.o`

### 優化

- `-O0` `-O1` `-O2` `-O3` `-Ofast`<br>
  一般編譯優化

### 警告、除錯

- `-Wall`<br>
  很多警告
- `-Wextra`<br>
  更多警告
- `-Wshadow`<br>
  區域變數跟別人撞名的警告
- `-Wconversion`<br>
  沒有好好轉型別的警告
- `-fsanitize=address`<br>
  幫你抓記憶體亂戳
- `-fsanitize=undefined`<br>
  幫你抓未定義行為
- `-D_GLIBCXX_DEBUG`<br>
  幫你抓 STL 亂用，編譯時間超級慢

### 其他

- `--verbose`<br>
  變吵。可以用來偷看 include 路徑

## TL;DR

競程向編譯指令，最後一行自選。

```bash
g++ {file}.cpp -o {file}.out
    -std=c++14
    -D LOCAL
    -O2
    -Wall -Wextra -Wshadow -Wconversion
    -fsanitize=address -fsanitize=undefined -D_GLIBCXX_DEBUG
```

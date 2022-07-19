---
title: Markdown Test
description: 各種 Markdown 功能測試
toc: true
authors: []
tags: [test, markdown]
categories: []
series: [test]
date: 2022-07-19T02:12:24+08:00
lastmod: 2022-07-19T02:12:24+08:00
featuredVideo:
featuredImage:
draft: false
---

測試各種 Markdown 語法能不能正常顯示，確認我 CSS 沒有寫爛 OAO

順便當成是 cheatsheet，以後不知道要怎麼寫就回來抄這篇 wwwww

## 測試

### 數學

$$
    e^{i\pi} = -1
$$

### 程式碼

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "owo!\n";
    return 0;
}
```

```py
import math

print("我不會數學")
```

### 超連結、引用

[點我](https://www.youtube.com/watch?v=3B-_kqqWnQI)

真的不是 [rickroll][1] 啦

### 圖片

nacho >////<

![external image](https://stickershop.line-scdn.net/stickershop/v1/product/12126860/LINEStorePC/main.png;compress=true)

![internal image]({{< img "nacho_sleeping.png" >}})

### 表格

想不到要放什麼 -w-

|   | 靜電力 | 電位能 |
|---|---|---|
| 量值 | 靜電力 $F = \frac{kq_1q_2}{r^2}$ | 電位能 $U = \frac{kq_1q_2}{r}$ |
| 單位電荷 | 電場 $E = \frac{kq}{r^2}$ | 電位 $V = \frac{kq}{r}$ |

### 清單

- 無序
- 清單

1. 有序
2. 清單

### Quote

> 凡事應該用腦筋好好想一想。俗話說：「眉頭一皺，計上心來。」就是說多想出智慧。要去掉我們黨內濃厚的盲目性，必須提倡思索，學會分析事物的方法，養成分析的習慣。
> —《學習和時局》（一九四四年四月十二日），《毛澤東選集》第九五二頁

### 標題階層

text

#### h4

text

##### h5[^1]

text

###### h6

text

<!-- footnotes -->
[^1]: 第五層和第六層標題長的跟內文一樣

<!-- reference links -->
[1]: https://www.youtube.com/watch?v=dQw4w9WgXcQ

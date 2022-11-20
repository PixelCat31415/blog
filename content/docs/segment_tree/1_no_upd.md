---
title: 線段樹與無修改、區間查詢問題
description:
toc: true
authors: []
date: 2022-11-17T20:26:39+08:00
lastmod: 2022-11-17T20:26:39+08:00
draft: true
weight: 2
---

此類區間查詢問題往往可以以遞迴分治解決，而就像前一節提到的，蓋一棵線段樹就像把整棵遞迴樹中，每個函數呼叫需要的資訊和答案存起來，可以幫我們在多次查詢時不需要重複計算之前詢問過的區間。

## 區間最大公因數

> 給一個序列 $a_1, a_2, a_3, \dots, a_N$，$Q$ 次詢問 $l_i, r_i$，每次請你找出所有 $a_k (k\in [l_i, r_i])$ 的最大公因數。
>
> $N, Q \leq 5\times 10^5$
>
> —（經典問題）

首先觀察到，

$$
gcd(a, b, c) = gcd(a, gcd(b, c))
$$

其中 $gcd(\dots)$ 代表裡面所有數字的最大公因數。也就是說，一個區間要求 GCD，相當於砍一半、兩邊求 GCD 再求 GCD，可以分治並 $O(1)$ 合併。

如此一來線段樹上存的就會是一個區間裡所有元素的 GCD，詢問時找到所有需要的區間、把這些區間的答案求 GCD 即可。因為線段樹有 $O(N)$ 個節點，合併兩個節點的答案需要 $O(1)$，因此總複雜度為預處理 $O(N)$、所有詢問共 $O(Q\log N)$。

事實上此問題也可以用 sparse table 達到預處理 $O(N\log N)$、詢問 $O(Q)$。

## 區間一次函數合成

> 給 N 個函數 $f_i(x) = a_i x + b_i$，$Q$ 次詢問 $l_i, r_i, x_i$，每次請你找出
> $$f_{r_i}(f_{r_{i-1}}(\dots f_{l_i}(x_i))) \mod 998244353$$
>
> $N, Q \leq 5\times 10^5$
>
> —[Library Checker](https://judge.yosupo.jp/problem/point_set_range_composite)（改）

取模只是要避免數字大到飛起來。同樣的應用分治想法，我們可以發現：

$$
f_2(f_1(x)) = a_2 (a_1 x + b_1) + b_2
            = (a_1 a_2) \cdot x + (a_2 b_1 + b_2)
$$

所以，兩個一次函數可以「合併」成一個，也就是說當我有很多個函數要合成時，我可以把這些函數分成兩半分別合成，再把兩個一次函數 $O(1)$ 合併成一個，就像上面的區間 GCD 一樣。

因此每個線段樹節點會存一個一次函數，代表區間裡的所有函數合成起來，詢問時合併需要的節點就可以找到一個一次函數能代表整個詢問區間合成的結果。因為合併節點也是 $O(1)$，複雜度一樣是預處理 $O(N)$、詢問 $O(Q\log N)$。

## 潛水艇（2022 實中校內賽）

## 凸包線段樹（2021 TOI 二模）
---
title: 線段樹的精神
description: 其實可以跳過的一點小前言
toc: true
authors: []
date: 2022-11-17T19:31:51+08:00
lastmod: 2022-11-17T19:31:51+08:00
draft: false
weight: 1
---

線段樹的精神是什麼？為什麼線段樹能處理這麼多序列問題？就我目前的觀點，線段樹展現兩個主要的概念。

## 分治

最經典的線段樹通常是用遞迴實做，從這點就可以看到線段樹跟分治的聯繫。在序列問題上，有許多的遞迴是要把區間砍一半，左邊做事、右邊做事、兩邊再合併，而線段樹正好長得非常像這種遞迴的遞迴樹。

舉例來說，若我們有一個序列，不修改、多次詢問區間和，我們可以輕易的以線段樹實做：線段樹中每個節點儲存一段區間的和，並且這個和會是該節點兩個小孩的區間和相加（葉子代表的區間只有一個元素，區間和就是那個元素）。這對應到同一個問題的遞迴作法：給一個序列，要詢問一個區間的和時，檢查序列是不是被區間整個包含，是的話就求整個序列和，不是的話把序列砍一半，遞迴求兩邊的答案加起來。可以發現，在遞迴版本中考慮所有可能的函數呼叫，這棵遞迴樹就會是線段樹的形狀，遞迴版本中一次呼叫想算的序列和，就是線段樹對應節點上儲存的區間和。

這暗示我們，只要是可以切一半分治的問題，有許多都可以搬到線段樹上做。

## 偷懶

若只有如此，線段樹只是幫你把整個遞迴樹畫出來，沒什麼優勢。但線段樹的強大之處在於，他可以把遞迴中用到的資訊儲存起來之後繼續用，**答案能只算一次的絕對不算第二次**。舉例來說，剛剛的區間和問題，也許用遞迴的話每次都要遞迴到底 $O(n)$ 計算，但在線段樹上，整棵可能的遞迴樹都已經預先 $O(n\log n)$ 算好了，接下來遞迴時只要發現有序列上的區間被詢問區間包含，就可以 $O(1)$ 拿到之前記下來的結果，更棒的是只需要 $O(\log n)$ 個線段樹節點就可以拼湊出任意的詢問區間。藉由重複利用線段樹上的資訊，不管來幾個詢問我們都可以偷懶拿之前算好的一部分答案拼湊新的的答案。

另外，在帶修改的序列問題中，懶人標記的技巧同樣幫助我們在更新、算答案的時候偷懶，**能以後再修改的不要現在改，能一起修改的不要一個一個改**。舉例來說，遇到區間加值、區間求和的問題，假如對同一個（一些）元素做很多次加值，那根本就可以全部累積起來一次改，所以與其每一次加值都對每個元素加一次，不如用懶人標記把操作累積起來，等到要詢問了、或者底下的元素要做的操作不一樣了，再全部一次修改；同樣的，假如我對一個區間加值，求答案（總和）的時候其實不需要知道區間裡每個元素的最終長相，只要看所有元素修改前總和、再一次加上加值對每個人的貢獻（只跟元素數量有關，跟元素本身的長相無關），就可以知道最後的答案，因此大可修改時留一個記號給整個區間就好，不需要逐一造訪區間裡每個元素，反正之後詢問時可以一起做。

所以對於可以重複利用的信息、可以省略或合併的操作，線段樹可以省下冗餘的計算。

---

因此，線段樹利用懶惰的精神，可以加速分治算法，處理具有多次修改、多次詢問特性的問題。

當然，在這裡我以無修改區間求和為例，實際上這個問題應該以前綴和做到 $O(n)$ 預處理 $O(1)$ 詢問。這也說明了線段樹並不應該被濫用，對於更簡單的問題、更好用的性質或許能找到更簡潔的作法。

接下來將會分類說明常見的線段樹應用技巧。

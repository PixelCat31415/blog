---
title: Typst 初體驗
description:
toc: true
authors: []
tags: [Typst]
categories: []
series: []
date: 2025-03-05T14:48:24+08:00
lastmod: 2025-03-05T14:48:24+08:00
featuredVideo:
featuredImage:
draft: false
---

大概上學期聽說有 Typst 這個東西，據說是一群討厭 LaTeX 的人想搞個替代方案，過完年終於有個小空檔可以來試試看。

學一個禮拜覺得使用體驗太棒了，以後都不想再用 LaTeX 了 😋


## 關於 Typst 和使用感想

基本上就是個 LaTeX 的替代品，可以寫字、寫數學式、排版之類的。最大的不一樣是 Typst 內建一個 scripting language，可以用腳本的形式控制要輸出什麼，像是寫程式一樣。LaTeX 仰賴很多反斜線開頭的 macro，很難做到像寫程式一樣條件判斷或迴圈之類的事情；typst 裡面幾乎看不見反斜線，寫指令的方式幾乎跟一般程式語言沒什麼差。

另一個我很喜歡的地方是 typst 的排版邏輯大概可以用 HTML DOM tree 的那套概念理解，一下就有一種親切感，哪裡歪歪的看不順眼還知道要改哪裡。相比之下至今還是覺得 latex 的各種 spacing 很玄學。

Typst 的數學模式寫法也跟 LaTeX 差很多，最有感的是分數不用再 `\frac{}{}` 了，大幅改善生活品質。各種符號不用再一直反斜線還不錯。但是很多符號的名字跟 LaTeX 不一樣，又要再重記一套，覺得相當不舒服，尤其是箭頭系列，至少讓我 alias 一下 LaTeX 的舊名字吧。用小括號取代大括號我也覺得沒什麼必要又違反習慣。不過整體來說應該還是改善的部份比較多。

LaTeX 其中一個最強的用途是用 TikZ 畫圖，typst 也有對應的工具叫 CeTZ。雖然 CeTZ 有些功能沒那麼齊全，但是基本上 TikZ 辦得到的 CeTZ 沒什麼辦不到，配上 typst 內建的 scripting language 有一種能夠寫程式畫圖的感覺，比 TikZ 多太多自由了。

Typst 還有一個大優勢是完整的文件和看得懂的原始碼。[官方文件](https://typst.app/docs/)有完整的 language/library reference 和新手教學，想找指令或是什麼指令不會用都可以很快找到；typst 還有開源在 [GitHub](https://github.com/typst/typst) 上，原始碼是用 rust 寫的，真的想找更深的東西也挖得到（像是去找一些預設樣式之類的）。相較 LaTeX 比較仰賴論壇上各種奇怪的討論串的奇怪黑魔法指令，我相當喜歡 typst 的透明度。

Typst 另外一個優勢是編譯賊快，還支援 live preview，比隔壁編譯一次要幾秒的 LaTeX 舒服多了。

底下紀錄一下我用 Typst 搞的一些東西。


## CeTZ 版本 Remember Picture & Overlay

TikZ 有兩個選項叫 remember picture 和 overlay，可以讓你在其他字上面疊一張 TikZ 的圖，還可以定位一張紙上面的其他內容。像是這樣（這是我的某次 SP 作業）

![tikz overlay]({{< img "typst-1.png" >}})

截圖上所有字和橫的虛線是一般 LaTeX 表格，箭頭是蓋上去的 TikZ picture，箭頭端點是一個 TikZ coordinate。

不過這些都不是重點，重點是我想在 Typst 重現：

1. 在整個頁面的任意位置蓋 CeTZ canvas
2. 能夠插入行內定位點，在 CeTZ canvas 裡定位他們

最大的障礙是 CeTZ 不能讓你 reference 其他 CeTZ canvas 上的元素，所以 TikZ 那套沒辦法照搬。

最後的解決辦法是用 [label](https://typst.app/docs/reference/foundations/label/) 當定位點，加上 [locate](https://typst.app/docs/reference/introspection/locate/) 可以拿到一個定位點的座標。canvas 可以裝在 [place](https://typst.app/docs/reference/layout/place/) 裡面，定好 canvas 位置和單位長就可以準確重現那些位置。code 大概像下面這樣。

```typst
#let marker(label-name) = {
  context {
    box(height: measure("").height, place(horizon)[#[] #label(label-name)])
    sym.wj
    h(0pt, weak: true)
  }
}

#let find(label-name) = {
  let pos = locate(label(label-name)).position()
  (pos.x.pt(), -pos.y.pt())
}

#let overlay(body) = {
  place(top + left, dx: -page.margin.left, dy: -page.margin.top)[
    #canvas({
      draw.circle((1, -1), radius: 1, fill: none, stroke: none)
      body
    }, length: 1pt, padding: 0)
  ]
}
```

overlay 裡面的那個隱形小圓形是為了讓 canvas 乖乖把紙張最左上角當 (0, 0)。但是因為這個作法，有一個小瑕疵可能是如果畫圖畫到超出頁面上面和左邊的邊界，整個圖的位置都會跑掉，還沒認真想過怎麼解決這個問題。

最後 code 其實很短，不過那時候好像搞了很久，skill issue。實際效果大概像這樣。

![cetz overlay]({{< img "typst-2.png" >}})


## CeTZ 線段樹

之前用 TikZ 畫過最複雜的圖應該是做 IOIC 講義和投影片的時候畫線段樹和 treap。但是 LaTeX 在常理範圍內沒辦法寫程式，所以我都用 python 或 C++ 產生 TikZ code 然後用手複製到 LaTeX 裡面（現在想一想根本就應該產生一個 .tex 檔案然後 `\input`，不過應該也沒有不麻煩多少）。這個流程我覺得有點麻煩，哪裡顏色或間距看不順眼的話 *改指令 ➡️ 重新生 TikZ code ➡️ LaTeX 編譯 ➡️ 看到結果* 的過程也有點太久。

（那些說 [LaTeX 是 turing complete](https://www.overleaf.com/learn/latex/Articles/LaTeX_is_More_Powerful_than_you_Think_-_Computing_the_Fibonacci_Numbers_and_Turing_Completeness) 的，歡迎你先用 LaTeX 寫一棵線段樹給我看。你寫出來了我也不寫，我承認我不夠會寫程式好不好。我都寧願用組合語言寫線段樹。）

自帶 scripting language 的 typst 幾乎能解決所有不舒服，只要用 typst 寫一棵線段樹就好了。線段樹誰不會寫，唯一比較特別的是在 typst 函數裡面，只有參數和區域變數是可以修改的，外面的 scope 的變數都是 read only，所以線段樹要寫成持久化 `seg = update(seg)` 之類的那種形狀。

![segment tree 1]({{< img "typst-3.png" >}})

![segment tree 2]({{< img "typst-4.png" >}})

上面的圖都是從原本的序列自動畫出來的。code 我就不放了，有點長。老實說這樣寫碼量可能沒有少很多，但是從改 code 到看見畫面的時間短很多，還能更細緻的控制節點怎麼畫，我覺得還是不錯的。


## Code Block

![]({{< img "typst-5.png" >}})

大概是比較沒創意的一個。我想加的是行號、背景色、highlight 指定行數之類的，實際辦法是開一個表格，第一欄是行號，第二欄是程式碼，一列放一行 [line](https://typst.app/docs/reference/text/raw/#definitions-line)。

寫完之後才發現早就有人做過遠遠比這個更完整的套件 [codelst](https://typst.app/universe/package/codelst/) 了 🤡 🤡 🤡


## 下一步

還真不知道下一步是什麼 :zzz:

之前用 LaTeX 最多的課應該是 ADA、NASA 和 ML，這學期的課比較多要寫程式不用寫 report。IOIC 的話要換到 typst 有點沒那麼實際。總之好像暫時可能用不太到 typst。

不過 typst 寫起來還是很舒服的，哪天一定會派上用場。



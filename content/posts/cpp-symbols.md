---
title: C++ 的強符號與弱符號
description:
toc: true
authors: []
tags: []
categories: []
series: []
date: 2025-05-12T06:41:14+08:00
lastmod: 2025-05-12T06:41:14+08:00
featuredVideo:
featuredImage:
draft: false
---

系統程式設計和作業系統和計算機結構都有教（所以說為什麼同一件事要教三次），C/C++ 原始碼會編譯（compile）成 object file，很多個 object file 可以連結（link）成一個可執行檔。C/C++ 裡面的變數、函數之類的東西在 object file 裡面變成 symbol，symbol 又有強和弱......

總之說簡單也不是真的真的很簡單，我大概不會是網路上最會解釋這個的，所以這裡就不細說。一個經典的例子是你有兩個檔案（`include` 啥的不重要，先省了）：

```cpp
// a.cpp
extern int x;  // weak symbol
void f() {
    x = 48763;
}
```

```cpp
// main.cpp
void f();
float x;  // strong symbol
int main() {
    x = 0.47863;
    f();
    cout << x << "\n";
}
```

走在路上總會看到大家寫 library 都寫一個標頭檔叫你 include，實際的實做在別的地方，就是因為強弱符號的問題。如果函數實做在標頭檔裡，好幾份程式碼都 include 他，每一份編出來的 object file 都有這個函數的強符號，一想連結他們的時候 linker 立刻跟你翻臉。所以 include 只能 include 一個宣告，實際的實做只能有一個人有，連結的時候再把那個人手上的函數本體連結進來。

於是我想起 STL。有時候點開 `std::vector` 原始碼之類的，標頭檔之長，整個 vector 都寫在一個幾千行的標頭檔裡，那為什麼很多檔案 include `std::vector` 的時候都不會撞車？`readelf` 一下發現 vector 底下的函數都是弱符號，那就合理了。

呃，但是，憑什麼他們是弱符號？難道函數包在 class 裡面就了不起啊？

```cpp
class Class {
public:
    int what() {
        return 48763;
    }
};

int f() {
    return Class().what();
}
```

還真的特別了不起，這個 `what()` 函數確實變成了一個弱符號，甚至如果把 `f()` 刪掉的話 `what()` 會直接被編譯器優化掉，不出現在 object file 裡。實際上是實做在 class 裡面的函數自動會變 inline，而 inline 的東西會是弱符號。

```cpp
class Class {
public:
    int what();
};

int Class::what() {
    return 48763;
}

int f() {
    return Class().what();
}
```

這次他變成強符號了！？

我實在是沒有很懂為什麼要把有被實做的 member function 搞成預設 inline，隨手找一下大概只找到 [這個](https://stackoverflow.com/questions/64908813/why-is-the-symbol-of-member-function-weak)，還是不太理解。

如果搞成弱符號的話不就可以這樣了？

```cpp
class Class {
public:
    int what() {
        return 48763;
    }
};

int f() {
    return Class().what();
}
```

```cpp
#include <iostream>

class Class {
public:
    int what() {
        return 494949;
    }
};

int f();

int main() {
    std::cout << f() << "\n";
    std::cout << Class().what() << "\n";
    return 0;
}
```

```cpp
// output
48763
48763
```

還蠻荒謬的，不過還蠻好笑的。

然後又讓人想到像 `std::clamp` 這種沒有包在 class 裡面的東西，他編譯出來居然也是弱符號。一番搜索發現怎麼有好幾個 clamp，還有一個有被實做？

```cpp
// stl_algo.h L3621-3627
  template<typename _Tp>
    [[nodiscard]] constexpr const _Tp&
    clamp(const _Tp& __val, const _Tp& __lo, const _Tp& __hi)
    {
      __glibcxx_assert(!(__hi < __lo));
      return std::min(std::max(__val, __lo), __hi);
    }

// algorithmfwd.h L217-220
  template<typename _Tp>
    _GLIBCXX14_CONSTEXPR
    const _Tp&
    clamp(const _Tp&, const _Tp&, const _Tp&);
```

原來是因為掛著 `constexpr` 的函數也會變弱符號。

老實說我覺得這一整篇講的每一件事我都覺得好像有一點點道理又沒什麼道理，突然又想起有人說 C 不是一個低階語言，那 C++ 更不是了。我現在看著「現代」C++ 每天都一邊不理解一邊破防，複雜到讓人無語。

大概是某種沒什麼用或是不怎麼新奇的已知用火等級的發現，不過看在我為了實驗這個東西花了好久也破防了好久，還是寫一篇悼念被我浪費在這個問題上的人生。

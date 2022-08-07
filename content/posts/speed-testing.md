---
title: 如何測試 Judge 速度
description: 「我不是小丑，我是整個馬戲團」
toc: true
authors: []
tags: [C++, 組合語言, 競程]
categories: []
series: []
date: 2022-08-07T15:16:37+08:00
lastmod: 2022-08-07T15:16:37+08:00
featuredVideo:
featuredImage:
draft: false
---

通常在各種比賽開始前都會有一段測機時間。這段時間可以測試編譯器有沒有支援一些特殊語法（`__int128`、pbds 等），許多人也會一併測試 judge 的執行速度是否正常。然而如何精準的測量一台機器執行程式的速度？為了解答這個問題我出於好奇做了一些實驗，雖然實用價值不大，不過我覺得實驗的過程頗為有趣。

不想看廢話的可以直接跳到結論。

## 正常的作法

通常我們會想測試一秒能夠執行多少個運算，其中 `+` `-` `*` `/` 等又不太一樣，浮點運算又不太一樣。不過我們只想知道一個大概，比如說一秒加法能做幾次？

```cpp
const int kITER = 1'000'000'000; // 1e9 iteration

int res = 0, inc = 49;
for(int i = 0; i <= kITER; i++) {
    res += inc;
}
cout << "res = " << res << "\n";
```

只要把這段丟上去給 judge，看是 AC 還是 TLE 就知道一秒能不能跑完 $10^9$ 次加法了（差不多是正常速度）。或者假如比賽平台有提供 custom test（像 cms 就有），我們也可以把下面這段程式碼丟上去，看看他在 judge 端輸出了什麼結果。作為實驗，我們先測測看本地的執行速度，完整的程式碼大概長這樣：

```cpp
// test.cpp
#include <iostream>
#include <iomanip>
#include <ctime>

void Timer(bool output = true) {
    static clock_t last = -1;
    clock_t now = std::clock();
    if(last != -1 && output) {
        std::cerr << "Elapsed: " << ((double)(now - last) / CLOCKS_PER_SEC) << " s\n";
    }
    last = now;
}

void DoTest() {
    const int kITER = 1'000'000'000; // 1e9 iteration
    int res = 0, inc = 49;
    for(int i = 0; i <= kITER; i++) {
        res += inc;
    }
    std::cout << "res = " << res << "\n";
}

int main() {
    std::cerr << std::fixed << std::setprecision(3);
    Timer(); DoTest(); Timer();
    return 0;
}
```

```txt
[-O2 optimization]

<stdout>
res = 1755359793

<stderr>
Elapsed: 0.000 s
```

呃，蛤，瞬間？看來因為我平常開著 `-O2`，編譯器用某種方法優化掉了。我們可以偷看他的組合語言，找到很像 `DoTest` 的那段

```bash
$ g++ test.cpp -O2 -std=c++14 -S
```

```asm
; .....
_Z6DoTestv:
.LFB1929:
; .....
    call    _ZSt16__ostream_insertIcSt11char_traitsIcEERSt13basic_ostreamIT_T0_ES6_PKS3_l@PLT
    movq    %rbx, %rdi
    movl    $1755359793, %esi
    call    _ZNSolsEi@PLT
; .....
```

省略了中間噴出一大坨不知道是什麼鬼，看起來跟 ostream 有關。不過注意中間的這行 `movl $1755359793, %esi`，1755359793 正好是輸出結果，也就是說開了 `-O2` 編譯器會自動幫你算好結果直接輸出，反正 `res`、`inc`、`kITER` 都是編譯時期就知道的事情。

要怎麼避免我們的測試程式碼被優化掉？

## 鎮壓編譯優化（一）：`-O0`

為了避免被編譯器優化掉，我們可以在編譯指令中用 `-O0` 來關掉所有編譯優化，或者不指定優化，因為 `-O0` 本來就是預設的優化等級

```bash
$ g++ test.cpp -O0 -std=c++14 -o test.out
```

或者也可以在程式碼前面加上

```cpp
#pragma GCC optimize("O0")
```

```txt
[-O0 optimization]

<stdout>
res = 1755359793

<stderr>
Elapsed: 1.527 s
```

時間看起來正常了！同樣的可以把加法換成其他運算，在我的機器上輸出如下。

| 運算 | 時間（秒 / 1e9 次運算） |
|:-----:|:-----:|
| + | 1.527 |
| - | 1.513 |
| * | 2.092 |
| / | 8.143 |
| % | 8.382 |
| ^ | 1.513 |

## 鎮壓編譯優化（二）：`volatile`

除了編譯優化之外，也可以用關鍵字 `volatile`（揮發性的）來阻止編譯器優化。`volatile` 用法很像 `const`，把變數宣告成 `volatile` 的意思是「這個變數的值可能會隨時改變，所以每次存取他的時候都請從記憶體裡重新讀取」。既然每次都重讀，那就不用擔心編譯器跳過計算過程了。

```cpp
void DoTest() {
    const int kITER = 1'000'000'000;
    volatile int res = 0    // notice this
    volatile int inc = 49;  // notice this
    for(int i = 0; i <= kITER; i++) {
        res += inc;
    }
    std::cout << "res = " << res << "\n";
}
```

```txt
[-O2 optimization]

<stdout>
res = 1755359793

<stderr>
Elapsed: 1.599 s
```

穩了。

## 鬼故事的開始

有趣的事情開始發生了，上面是 res、inc 兩個變數都加上 `volatile`，假如只加一邊呢？兩邊都不加呢？

| res | inc | 執行時間（秒） |
|:---:|:---:|:---------:|
| volatile | volatile |   1.599 |
| volatile |          |   1.643 |
|          | volatile |   0.638 |
|          |          | < 0.001 |

兩個都不加的情況被編譯器優化掉了所以是瞬間。可是為什麼只加一邊的情況會有差異？我們再次偷看程式碼產生的組合語言，因為組合語言最能顯現優化過的程式碼變成什麼樣子。

```bash
$ g++ test.cpp -S -std=c++14 -O2
```

### res、inc 都是 `volatile` 的情況

```asm
_Z6DoTestv:
; .....
    movl    $0, 8(%rsp)    ; res = 8(%rsp)
    movl    $49, 12(%rsp)  ; inc = 12(%rsp)
; .....
.L10:  ; 主迴圈
    movl    12(%rsp), %ecx
    movl    8(%rsp), %eax
    addl    %ecx, %eax
    movl    %eax, 8(%rsp)
    subl    $1, %edx
    jne     .L10
; .....
```

我們可以看到 res、inc 兩個變數都是存在記憶體裡，有各自的位址。迴圈做的事情是：

1. 把 inc 和 res 從記憶體讀出來，各自放到暫存器裡
2. 加起來
3. 把結果寫回記憶體裡的 res 裡

### 只有 res 是 `volatile` 的情況

```asm
_Z6DoTestv:
; .....
    movl    $0, 12(%rsp)  ; res = 12(%rsp)
; .....
.L10:  ; 主迴圈
    movl    12(%rsp), %eax
    addl    $49, %eax
    movl    %eax, 12(%rsp)
    subl    $1, %edx
    jne     .L10
; .....
```

inc 徹底從記憶體裡消失了，而是直接用一個常數 49 來代替。這是因為編譯器發現他根本不會變，所以**幫你節省了一次記憶體讀取**。

### 只有 inc 是 `volatile` 的情況

```asm
_Z6DoTestv:
; .....
    movl    $49, 12(%rsp)  ; inc = 12(%rsp)
; .....
.L10:  ; 主迴圈
    movl    12(%rsp), %edx
    addl    %edx, %ebx
    subl    $1, %eax
    jne     .L10
; .....
```

這次產生的組語更短了，換成 res 消失。取代 res 的是暫存器 ebx，也就是說編譯器發現這個變數不會影響到別人，所以**幫你節省了一次記憶體讀取和一次記憶體寫入**。

### 所以呢？

所以，我們發現省略的那次記憶體寫入，實際上可以幫我們省下約 60% 的執行時間！也就是說，我們想要測試的明明是做加法的時間，結果搞不好一大半的時間都在等記憶體讀寫。我們也可以偷看剛剛指定 `O0` 不優化，產生的組合語言長怎樣

```asm
_Z6DoTestv:
; .....
    movl    $0, -16(%rbp)
    movl    $49, -4(%rbp)
    movl    $0, -12(%rbp)
    jmp     .L20
.L21:
    movl    -4(%rbp), %eax
    addl    %eax, -16(%rbp)
    addl    $1, -12(%rbp)
.L20:
    cmpl    $1000000000, -12(%rbp)
    jle     .L21
; .....
```

可以看到仍然進行了許多記憶體讀寫，第 9 行的 `addl` 看起來無害，實際上因為是作用在記憶體上的 `-16(%rbp)` 所以還是有包含記憶體操作。

有沒有辦法完全避免記憶體的問題，只測出 `addl` 指令本身的速度？

## 傳說中的 `__asm__`

可以！我們可以自己在 C++ 中內嵌組合語言，對程式碼達到完全的控制！因為我沒寫過組合語言所以花了一些時間研究某個人寫的 [GCC's assembler syntax]，這篇 guide 裡對 `__asm__` 語法和各種附帶功能解釋的很清楚，初心者向，推薦大家都去看看 :heart:

經過一番努力上面的測試函數被改成了這樣

```cpp
void DoTest() {
    const int kITER = 1'000'000'000; // 1e9 iteration
    int res = 0, inc = 49;
    __asm__ __volatile__ (
        "   movl %3, %%ecx     ;\n"
        ".TEST_LOOP:           ;\n"
        "   addl %2, %0        ;\n"
        "   subl $1, %%ecx     ;\n"
        "   jne .TEST_LOOP     ;\n"
        :"=r"(res)
        :"r"(res), "r"(inc), "m"(kITER)
        :"%ecx"
    );
    std::cout << "res = " << res << "\n";
}
```

其中：

1. 這段組合語言需要輸入 res、inc 分別放在（任意）暫存器中，這樣就可以避免記憶體的讀寫操作
2. ecx 暫存器存迴圈的索引值
3. 編譯優化開 `O0` 或 `O2` 都沒差，輸出組語是一樣的

輸出結果：

```txt
[-O2 optimization]

<stdout>
res = 1755359744

<stderr>
Elapsed: 0.334 s
```

因此，實際上 $10^9$ 次加法只花費了約 20% 的時間，其餘 80% 都在等待記憶體操作！

## 走火入魔

### 不只加法

既然都搬出組語了，我們當然可以把加法換成其他操作......嗎？然而，沒寫過組語的我什麼指令都不認識，因此我們可以先寫好一段簡單的 C++

```cpp
int owo() {
    int a = 48763;
    int b = 49;
    int c = a / b;
    return c;
}
```

然後偷看組合語言的長相

```asm
_Z3owov:
.LFB1909:
    .cfi_startproc
    pushq   %rbp
    .cfi_def_cfa_offset 16
    .cfi_offset 6, -16
    movq    %rsp, %rbp
    .cfi_def_cfa_register 6
    movl    $48763, -12(%rbp)
    movl    $49, -8(%rbp)
    movl    -12(%rbp), %eax
    cltd
    idivl   -8(%rbp)
    movl    %eax, -4(%rbp)
    movl    -4(%rbp), %eax
    popq    %rbp
    .cfi_def_cfa 7, 8
    ret
```

組合語言的指令雖然簡短，不過通常還是可以猜出大概的意思，這裡出現兩個之前沒看過的指令 `cltd`、`idivl`，經過一番 Google 順便翻翻文件 [x86 and amd64 instruction reference]，我們確定負責除法的就是第 11 到 13 行。所以我們可以改改前面的 code，測量除法運算[^註1]的時間

```cpp
void DoTest() {
    const int kITER = 1'000'000'000; // 1e9 iteration
    int res = 48763, denom = 49;
    __asm__ __volatile__ (
        "   movl %3, %%ecx            ;\n"
        ".TEST_LOOP_DIV:              ;\n"
        "   cltd                      ;\n"
        "   idivl %%ebx               ;\n"
        "   subl $1, %%ecx            ;\n"
        "   jne .TEST_LOOP_DIV        ;\n"
        :"=a"(res)
        :"a"(res), "b"(denom), "m"(kITER)
        :"%ecx"
    );
    std::cout << "res = " << res << "\n";
}
```

甚至是浮點運算（在這裡是除法）

```cpp
void DoTest() {
    const int kITER = 1'000'000'000; // 1e9 iteration
    double res = 0.1;
    double denom = 1.000001;
    __asm__ __volatile__ (
        "   movl %3, %%ecx             ;\n"
        "   movq %1, %%xmm0            ;\n"
        "   movq %2, %%xmm1            ;\n"
        ".TEST_LOOP_FDIV:              ;\n"
        "   divsd %%xmm1, %%xmm0       ;\n"
        "   subl $1, %%ecx             ;\n"
        "   jne .TEST_LOOP_FDIV        ;\n"
        "   movq %%xmm0, %0            ;\n"
        :"=m"(res)
        :"m"(res), "m"(denom), "m"(kITER)
        :"%ecx", "%xmm0", "%xmm1"
    );
    return res;
}
```

### 不只算術運算

前面提到簡單的一行加法花了大把時間在記憶體存取，我們當然可以測到記憶體存取到底花了多少時間，甚至不需要用到組語，只要把先前的 `+=` 改成 `=` 就好。這裡先不考慮快取之類的可怕的問題

```txt
[-O0 optimization]

<stdout>
res = 49

<stderr>
Elapsed: 2.061 s
```

虫合？不用加法居然變慢了？

### 失控的鬼故事

這個問題已經超出目前我能自己找到答案的範圍了。

我目前想得到的原因偏向某種神奇的 pipelining，因為 CPU 自己也在機器碼層級做超級多事情，也許他用某種方式平行處理了一些加法指令之類的，但是這只是我的猜測。除此之外，前面的許多測試到底真的準確嗎？還有沒有其他因素會影響程式執行的速度、要怎麼排除這些因素？也許等我哪天變硬體大師、對 CPU 有更多了解才能好好解答這些問題 OAO

> Modern CPUs are complex beasts. —[某篇 stackoverflow][stackoverflow CPU cycles]

## 結論

到這裡為止，我們算是用了盡可能準確的方式測到了 CPU 執行各種指令需要的時間，雖然顯的有點殺雞用牛刀了。不過有一個最重要的問題：測到這個然後呢？

基本上沒有用。

追根究底，我們測 judge 速度的目的是要決定，在複雜度算出來離時限感覺比較接近的時候，要不要賭他常數夠小 judge 能跑完，假如 judge 本來就偏慢的話那被卡常的機率也會比較高；此外，在實際應用的情況，我們也不可能為了避免記憶體存取太慢，就直接在賽場裡開寫組合語言來賺那點常數優勢。所以，既然所謂「judge 的速度」只是參考性質估計用，測出那點速度差異根本沒什麼參考價值，我們需要知道的只有跟其他機器比起來，這台伺服器的速度有沒有特別快或特別慢。

我們大可相信一開始那段最單純的 code 就足以估計 judge 是快是慢。

```cpp
#pragma GCC optimize("O0")
#include <iostream>
#include <iomanip>
#include <ctime>
using namespace std;

int main() {
    auto start = clock();

    int res = 0, inc = 49;
    for(int i = 0; i <= 1e9; i++) {
        res += inc;
    }
    cout << "res = " << res << "\n";

    auto end = clock();
    cout << fixed << setprecision(3);
    cout << "Elapsed: " << ((double)(end - start) / CLOCKS_PER_SEC) << " s\n";
    return 0;
}
```

```txt
<stdout>
res = 1755359793
Elapsed: 1.540 s
```

話雖如此，我覺得學習組合語言的過程還是很有趣的！

## References

1. [GCC's assembler syntax]
2. [AT&T Assembly Syntax]
3. [x86 and amd64 instruction reference]
4. [某篇 stackoverflow，關於每個指令到底要花費幾個 cycle][stackoverflow CPU cycles]
5. [Algorithmica 的 pipelining 章節][algorithmica Instruction-Level Parallelism]

[^註1]: 一個中途發現的 fun fact 是：除法、模運算的組語指令一樣，因為 [`idiv` 指令](https://www.felixcloutier.com/x86/idiv)會同時計算商數和餘數存在兩個暫存器裡面，C++ 裡的除法和模只差在從哪個暫存器拿結果而已

[GCC's assembler syntax]: https://www.felixcloutier.com/documents/gcc-asm.html
[AT&T Assembly Syntax]: https://csiflabs.cs.ucdavis.edu/~ssdavis/50/att-syntax.htm
[x86 and amd64 instruction reference]: https://www.felixcloutier.com/x86/
[stackoverflow CPU cycles]: https://stackoverflow.com/questions/692718/how-many-cpu-cycles-are-needed-for-each-assembly-instruction
[algorithmica Instruction-Level Parallelism]: https://en.algorithmica.org/hpc/pipelining/

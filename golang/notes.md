### Golang

This is a [Golang](https://go.dev) course provided by [boot.dev](https://www.boot.dev/).
All the content is theirs but these are my notes used for learning purposes only.

\nl

#### Basic Variables

_bool: a boolean value, either true or false_
\nl
_string: a sequence of characters_
\nl
_int: a signed integer_
\nl
_float64: a floating-point number_
\nl
_byte: exactly what it sounds like: 8 bits of data_

#### Declaring a Variable the Sad Way

pre.conr
var mySkillIssues int
mySkillIssues = 42
pre.conr

The first line, _var mySkillIssues int_, defaults the _mySkillIssues_ variable to its zero value, _0_. On the next line, _42_ overwrites the zero value.

pre.conr
mySkillIssues := 42
pre.conr

The walrus operator, _:=_, declares a new variable and assigns a value to it in one line. Go can infer that _mySkillIssues_ is an _int_ because of the _42_ value.

#### The Compilation Process

Computers need machine code, they don't understand English or even Go. We need to convert our high-level (Go) code into machine language, which is really just a set of instructions that some specific hardware can understand. In your case, your CPU.
\nl
The Go compiler's job is to take Go code and produce machine code, an .exe file on Windows or a standard executable on Mac/Linux.

[compilation](./img/compilation.png)

#### Go Program Structure

pre.conr
package main

    import "fmt"

    func main() {
        fmt.Println("The compiled textio server is starting")
    }

pre.conr

1. _package main_ lets the Go compiler know that we want this code to compile and run as a standalone program, as opposed to being a library that's
   imported by other programs.

\nl

2. _import "fmt"_ imports the _fmt_ (formatting) package from the standard library ([see more here](https://pkg.go.dev/fmt)). It allows us to use fmt.Println to print to the console.

\nl

3. _func main()_ defines the main function, the entry point for a Go program.

#### Two Kinds of Errors

1. Compilation errors. Occur when code is compiled. It's generally better to have compilation errors because they'll never accidentally make it into production. You can't ship a program with a compiler error because the resulting executable won't even be created.

\nl

2. Runtime errors. Occur when a program is running. These are generally worse because they can cause your program to crash or behave unexpectedly.

\nl

#### Compiled vs. Interpreted

You can run a compiled program without the original source code. You don't need the compiler anymore after it's done its job. That's how most video games are distributed! Players don't need to install the correct version of Go to run a PC game: they just download the executable game and run it.

[compilation vs interpret](./img/compileInterpret.png)

#### Same line variable declaration

pre.conr
mileage, company := 80276, "Toyota"

//same as

mileage := 80276
company := "Toyota"
pre.conr

#### Comparing Go's speed

Comparing Go's Speed

Go is generally faster and more lightweight than interpreted or VM-powered languages like:

\nl

_Python_
\nl
_JavaScript_
\nl
_PHP_
\nl
_Ruby_
\nl
_Java_
\nl

However, in terms of execution speed, Go does lag behind some other compiled languages like:

\nl
_C_
\nl
_C++_
\nl
_Rust_
\nl

Go is a bit slower mostly due to its automated memory management, also known as the "Go runtime". Slightly slower speed is the price we pay for memory safety and simple syntax!

[go speed](./img/goSpeed.png)

#### Formatting Strings in Go

Go follows the [printf](https://cplusplus.com/reference/cstdio/printf/) tradition from the C language. In my opinion, string formatting/interpolation in Go is less elegant than Python's f-strings, unfortunately.

\nl

[fmt.Printf](https://pkg.go.dev/fmt#Printf) - Prints a formatted string to standard out.

\nl

[fmt.Sprintf()](https://pkg.go.dev/fmt#Sprintf) - Returns the formatted string

See how formating verbs work [here](https://pkg.go.dev/fmt#hdr-Printing)

#### Runes and String Encoding

In many programming languages (e.g. C), a "character" is a single byte. Using [ASCII](https://www.asciitable.com/) encoding, the standard for the C programming language, we can represent 128 characters with 7 bits. This is enough for the English alphabet, numbers, and some special characters.

\nl

In Go, strings are just sequences of bytes: they can hold arbitrary data. However, Go also has a special type, [rune](https://go.dev/blog/strings), which is an alias for _int32_. This means that a _rune_ is a 32-bit integer, which is large enough to hold any [Unicode](https://home.unicode.org/) code point.

\nl

When you're working with strings, you need to be aware of the encoding (bytes -> representation). Go uses [UTF-8](https://en.wikipedia.org/wiki/UTF-8) encoding, which is a variable-length encoding.

\nl

There are 2 main takeaways:

\nl

When you need to work with individual characters in a string, you should use the rune type. It breaks strings up into their individual characters, which can be more than one byte long.
\nl
We can include a wide variety of Unicode characters in our strings, such as emojis and Chinese characters, and Go will handle them just fine.

\nl

#### Conditionals

_if_ statements in Go do not use parentheses around the condition:

pre.conr
if height > 4 {
    fmt.Println("You are tall enough!")
}
pre.conr

_else if_ and _else_ are supported as you might expect:

pre.conr
if height > 6 {
    fmt.Println("You are super tall!")
} else if height > 4 {
    fmt.Println("You are tall enough!")
} else {
    fmt.Println("You are not tall enough!")
}
pre.conr

#### The Initial Statement of an If Block

An _if_ conditional can have an "initial" statement. The variable(s) created in the initial statement are only defined within the scope of the _if_ body.

pre.conr

if INITIAL_STATEMENT; CONDITION {
}
pre.conr

##### Why Would I Use This?

It has two valuable purposes::

\nl

1. It's a bit shorter
2. It limits the scope of the initialized variable(s) to the if block

\nl

For example, instead of writing:

pre.conr
length := getLength(email)
if length < 1 {
    fmt.Println("Email is invalid")
}
pre.conr

We can do:

pre.conr
if length := getLength(email); length < 1 {
    fmt.Println("Email is invalid")
}
pre.conr

_length_ isn't available in the parent scope, which is nice because we don't need it there - we won't accidentally use it elsewhere in the function.

#### Switch

Switch statements are a way to compare a value against multiple options. They are similar to if-else statements but are more concise and readable when the number of options is more than 2.

pre.conr
func getCreator(os string) string {
    var creator string
    switch os {
    case "linux":
        creator = "Linus Torvalds"
    case "windows":
        creator = "Bill Gates"
    case "mac":
        creator = "A Steve"
    default:
        creator = "Unknown"
    }
    return creator
}
pre.conr

Notice that in Go, the _break_ statement is not required at the end of a _case_ to stop it from falling through to the next _case_. The _break_ statement is implicit in Go.

\nl

If you do want a case to fall through to the next case, you can use the fallthrough keyword.

pre.conr
func getCreator(os string) string {
    var creator string
    switch os {
    case "linux":
        creator = "Linus Torvalds"
    case "windows":
        creator = "Bill Gates"

    // all three of these cases will set creator to "A Steve"
    case "macOS":
        fallthrough
    case "Mac OS X":
        fallthrough
    case "mac":
        creator = "A Steve"

    default:
        creator = "Unknown"
    }
    return creator
}
pre.conr


### Functions in go 

Functions in Go can take zero or more arguments.
\nl
To make code easier to read, the variable type comes after the variable name.
\n
For example, the following function:

pre.conr
func sub(x int, y int) int {
    return x-y
}
pre.conr

Accepts two integer parameters and returns another integer.

\nl

Here, _func sub(x int, y int) int_ is known as the "function signature".


#### Multiple parameters

When multiple arguments are of the same type, and are next to each other in the function signature, the type only needs to be declared after the last argument.

pre.conr
func addToDatabase(hp, damage int) {
  // ...
}

func addToDatabase(hp, damage int, name string) {
  // ?
}

func addToDatabase(hp, damage int, name string, level int) {
  // ?
}
pre.conr

Left at:

pre.conr
https://www.boot.dev/lessons/a729ff01-7620-45a6-b330-7efb72bda67b
pre.conr
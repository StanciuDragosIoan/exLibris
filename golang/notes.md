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

pre.code
var mySkillIssues int
mySkillIssues = 42
pre.code

The first line, _var mySkillIssues int_, defaults the _mySkillIssues_ variable to its zero value, _0_. On the next line, _42_ overwrites the zero value.

pre.code
mySkillIssues := 42
pre.code

The walrus operator, _:=_, declares a new variable and assigns a value to it in one line. Go can infer that _mySkillIssues_ is an _int_ because of the _42_ value. 



#### The Compilation Process

Computers need machine code, they don't understand English or even Go. We need to convert our high-level (Go) code into machine language, which is really just a set of instructions that some specific hardware can understand. In your case, your CPU.
\nl
The Go compiler's job is to take Go code and produce machine code, an .exe file on Windows or a standard executable on Mac/Linux.

[compilation](./img/compilation.png)


#### Go Program Structure

pre.code
    package main

    import "fmt"

    func main() {
        fmt.Println("The compiled textio server is starting")
    }

pre.code


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
https://www.boot.dev/lessons/723bcd30-be47-4663-85b6-eb348abcf53f
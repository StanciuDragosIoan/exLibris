### The Document Object Model

When you open a web page, your browser retrieves the page’s _HTML_ text and parses it, much like our parser from
Chapter 12 parsed programs. The browser builds up a model of the document’s structure and uses this model to draw
the page on the screen.

[This is a link](http://www.google.com)

\nl

This representation of the document is one of the toys that a _JavaScript_ program has available in its sandbox.
It is a data structure that you can read or modify. It acts as a live data structure: when it’s modified,
the page on the screen is updated to reflect the changes.

\nl

You can imagine an HTML document as a nested set of boxes. Tags such as &lt;body&gt; and &lt;/body&gt;enclose
other tags, which in turn contain other tags or text. Here’s the example document from the previous chapter:

\nl

This page has the following structure:

[page](./img/14/page.jpg)

\nl

pre.code
console.log("test");
pre.code

The nodeValue property of a text node holds the string of text that it represents.

#### Finding elements

Navigating these links among parents, children, and siblings is often useful. But if we want to find a specific node in
the document, reaching it by starting at document.body and following a fixed path of properties is a bad idea. Doing so
bakes assumptions into our program about the precise structure of the document—a structure you might want to change later.
Another complicating factor is that text nodes are created even for the whitespace between nodes. The example document’s
&lt;body&gt; tag has not just three children (&lt;h1&gt; and two &lt;p&gt; elements), but seven: those three, plus the spaces
before, after, and between them.

\nl

If we want to get the _href_ attribute of the link in that document, we don’t want to say something like “Get the second child
of the sixth child of the document body”. It’d be better if we could say “Get the first link in the document”. And we can.

pre.code
let link = document.body.getElementsByTagName("a")[0];
console.log(link.href);
pre.code

All element nodes have a _getElementsByTagName_ method, which collects all elements with the given tag name that are descendants
(direct or indirect children) of that node and returns them as an array-like object.

\nl

To find a specific single node, you can give it an id attribute and use _document.getElementById_ instead.

pre.code
&lt;p&gt;My ostrich Gertrude:&lt;/p&gt;
&lt;p&gt;&lt;img id="gertrude" src="img/ostrich.png"&gt;&lt;/p&gt;

&lt;script&gt;
let ostrich = document.getElementById("gertrude");
console.log(ostrich.src);
&lt;/script&gt;
pre.code

A third, similar method is _getElementsByClassName_, which, like _getElementsByTagName_, searches through the contents
of an element node and retrieves all elements that have the given string in their class attribute.

#### Changing the document

Almost everything about the DOM data structure can be changed. The shape of the document tree can be modified by
changing parent-child relationships. Nodes have a remove method to remove them from their current parent node.
To add a child node to an element node, we can use appendChild, which puts it at the end of the list of children,
or insertBefore, which inserts the node given as the first argument before the node given as the second argument.

[Dom manipulation](./img/14/domManip.jpg)

A node can exist in the document in only one place. Thus, inserting paragraph Three in front of paragraph One
will first remove it from the end of the document and then insert it at the front, resulting in _Three/One/Two_.
All operations that insert a node somewhere will, as a side effect, cause it to be removed from its current
position (if it has one).

\nl

The _replaceChild_ method is used to replace a child node with another one. It takes as arguments two nodes:
a new node and the node to be replaced. The replaced node must be a child of the element the method is
called on. Note that both replaceChild and insertBefore expect the new node as their first argument.

#### Creating nodes

Say we want to write a script that replaces all images (<img> tags) in the document with the text held in
their alt attributes, which specifies an alternative textual representation of the image. This involves
not only removing the images but also adding a new text node to replace them.

[JS Script](./img/14/js_script.jpg)

Given a string, _createTextNode_ gives us a text node that we can insert into the document to make it
show up on the screen.

\nl

The loop that goes over the images starts at the end of the list. This is necessary because the node
list returned by a method like getElementsByTagName (or a property like childNodes) is live. That is,
it is updated as the document changes. If we started from the front, removing the first image would
cause the list to lose its first element so that the second time the loop repeats, where i is 1, it
would stop because the length of the collection is now also 1.

\nl

If you want a solid collection of nodes, as opposed to a live one, you can convert the collection
to a real array by calling Array.from.

pre.code
let arrayish = {0: "one", 1: "two", length: 2};
let array = Array.from(arrayish);
console.log(array.map(s => s.toUpperCase()));
// → ["ONE", "TWO"]
pre.code

To create element nodes, you can use the document.createElement method. This method takes a tag
name and returns a new empty node of the given type.

\nl

The following example defines a utility elt, which creates an element node and treats the rest
of its arguments as children to that node. This function is then used to add an attribution to
a quote.

pre.code
&lt;blockquote id="quote"&gt;
No book can ever be finished. While working on it we learn
just enough to find it immature the moment we turn away
from it.
&lt;/blockquote&gt;

&lt;script&gt;
function elt(type, ...children) {
let node = document.createElement(type);
for (let child of children) {
if (typeof child != "string") node.appendChild(child);
else node.appendChild(document.createTextNode(child));
}
return node;
}

document.getElementById("quote").appendChild(
elt("footer", "—",
elt("strong", "Karl Popper"),
", preface to the second edition of ",
elt("em", "The Open Society and Its Enemies"),
", 1950"));
&gt;/script&gt;
pre.code

#### Attributes

Some element attributes, such as href for links, can be accessed through a property of the
same name on the element’s DOM object. This is the case for most commonly used standard
attributes.

\nl

HTML allows you to set any attribute you want on nodes. This can be useful because it
allows you to store extra information in a document. To read or change custom attributes,
which aren’t available as regular object properties, you have to use the getAttribute
and setAttribute methods.

pre.code

&lt;p data-classified="secret"&lt;The launch code is 00000000.&gt;/p&gt;
&lt;p data-classified="unclassified"&gt;I have two feet.&gt;/p&gt;

&lt;script&gt;
let paras = document.body.getElementsByTagName("p");
for (let para of Array.from(paras)) {
if (para.getAttribute("data-classified") == "secret") {
para.remove();
}
}
&lt;/script&gt;
pre.code

It is recommended to prefix the names of such made-up attributes with data- to
ensure they do not conflict with any other attributes.

\nl

There is a commonly used attribute, _class_, which is a keyword in the JavaScript
language. For historical reasons—some old JavaScript implementations could not
handle property names that matched keywords—the property used to access this
attribute is called _className_. You can also access it under its real name,
_"class"_, with the _getAttribute_ and _setAttribute_ methods.

#### Layout

You may have noticed that different types of elements are laid out differently.
Some, such as paragraphs (&lt;p&gt;) or headings (&lt;h1&gt;), take up the whole width of the
document and are rendered on separate lines. These are called block elements.
Others, such as links (&lt;a&gt;) or the &lt;strong&gt; element, are rendered on the same
line with their surrounding text. Such elements are called inline elements.

\nl

For any given document, browsers are able to compute a layout, which gives each element
a size and position based on its type and content. This layout is then used to actually
draw the document.

\nl

The size and position of an element can be accessed from _JavaScript_. The _offsetWidth_
and _offsetHeight_ properties give you the space the element takes up in pixels. A pixel
is the basic unit of measurement in the browser. It traditionally corresponds to the
smallest dot that the screen can draw, but on modern displays, which can draw very
small dots, that may no longer be the case, and a browser pixel may span multiple
display dots.

\nl

Similarly, _clientWidth_ and _clientHeight_ give you the size of the space inside
the element, ignoring border width.

pre.code

&lt;p style="border: 3px solid red"&gt;
I'm boxed in
&lt;/p&gt;

&gt;script&gt;
let para = document.body.getElementsByTagName("p")[0];
console.log("clientHeight:", para.clientHeight);
// → 19
console.log("offsetHeight:", para.offsetHeight);
// → 25
&lt;/script&gt;
pre.code

The most effective way to find the precise position of an element on the screen is
the _getBoundingClientRect_ method. It returns an object with top, bottom, left, and
right properties, indicating the pixel positions of the sides of the element relative
to the upper left of the screen. If you want pixel positions relative to the whole
document, you must add the current scroll position, which you can find in the
pageXOffset and pageYOffset bindings.

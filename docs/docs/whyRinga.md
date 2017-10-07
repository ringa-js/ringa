When designing Ringa we asked the following questions:

1. What is the development problem?
2. What would be the most enjoyable code to write to solve it?
3. Is this going to scale and not impact the *computers performance*?
4. Is this going to scale and not impact the *next developers performance*?

We went back to the drawing board and put on our computer scientist caps to solve each problem and answer each of the 4 Questions. As a result, to understand why Ringa is so powerful a basic understanding of trees, graphs, algorithms, and software design patterns like singletons, factories, decorators, and dependency injection is a huge plus.

# Advantages

Ringa provides the following high-level architectural advantages:

* **Uses DOM event system**
  * Controllers are attached to a DOM node so there are no God objects
  * Use 'bubble' and 'capture' to communicate between controllers through the DOM
  * Intercept events at a higher level in the DOM so that the root of your application always has complete control
  * All RingaEvents include information on the view that dispatched them, the line of code they were dispatched from, the controller that is handling them, the commands that are responding, and much, much more
* **Follows the Best MVC principles**
  * Controllers are designed to keep your view, API, control, and model separated
* **Asynchronous Syntax**
  * Writing complicated trees of asynchronous and synchronous processes is simple
  * Reading someone else's complex tree of asynchronous tasks is straightforward
  * Extending, intercepting, or injecting into an existing asynchronous process is easy, but never interferes with debugging so there are no surprises
  * Debugging when something fails in a complex tree of asynchronous tasks is at your fingertips

# Developing with Ringa

Ringa is designed for enterprise-level applications and scales with your team to keep everyone happy. It is designed with the idea that you will eventually have a large application with a lot of library dependencies and also so that your code can be cordoned off into discrete sections so that there is less developer conflict during development.
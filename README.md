[<img src="http://www.jungdigital.com/public/ringa/logo/ringa.png" width="250">](http://demo.ringajs.com)

Ringa is a Javascript state and action framework designed with no global model, no global controllers, the simplicity of proven dependency injection, and asynchronous action trees.

It was designed primarily for ReactJS and eliminates the need for the container/component pattern.

*Note: Ringa is very much in alpha stage and a couple applications are being built on top of it. As such, it will be in a state of flux (no pun intended) for the next few months.*

# Live Demo!

[A live demo of the features of Ringa combined with ReactJS here](http://demo.ringajs.com)

# get started

    npm install -S ringa

# documentation

[Documentation can be found on the wiki.](http://www.github.com/jung-digital/ringa/wiki)

# features

**Controllers**

* Attach to DOM nodes (or busses on the server)
* Can use DOM events for communication (bubble, capture, stopPropagation, etc.)
* Manage asynchronous code in clean, readable trees of executors
* Rollback of each completed executor in the tree if an executor fails or is cancelled (COMING SOON)

**Asynchronous Executor/Task/Operation Trees**

* Executors can be Promises, Ringa commands, functions, dispatch of a new Ringa Event, or your own customization
* Arguments are injected into executors by argument name (similar to AngularJS)
* Executors can add new properties to the event details to be injected into the next executors
* Executors can be run in parallel or sequentially

**Models**

* Can be watched using the observer pattern
* Watching is customizable by event to improve specificity and therefore performance
* Watch notifications are batched and sent at once so your observers do not get spammed for every change in the model

**Ringa Events**

* Ringa events function like promises with `then` and `catch` support so you get notified when a full asynchronous task tree has completed

**Debugging (Dev mode only)**

* Ringa Events contain debugging information of the entire executor tree they triggered
* Ringa events contain the stack trace of where they were dispatched
* Highly specific errors are logged or thrown when you forget to use Ringa objects properly
* Ringa lets you know when you forget to pass a property to your executor tree

# support

* Dependency Injection and automated updates to ReactJS Components (through the [react-ringa](https://github.com/jung-digital/react-ringa) project)
* Promises
* async/await

# tested

* Coverage with Jest (> 150 unit tests so far and counting)

# development

This project is under active development, along with the following support projects:

* [react-ringa](https://github.com/jung-digital/react-ringa)
* [ringa-example-server](https://github.com/jung-digital/ringa-example-server)
* [ringa-example-react](https://github.com/jung-digital/ringa-example-react)

# license

MIT License (c) 2017 by Joshua Jung and Thomas Yarnall

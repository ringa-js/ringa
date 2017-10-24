# Welcome to Ringa JS!

Ringa JS is an enterprise single page application (SPA) framework that provides:

* MV\* Architecture
* State Management
* Observer Pattern
* Dependency Injection
* Asynchronous Toolset
* Error Management
* Core focus on performance, modularity, and scalability
* Zero dependencies on any other frameworks (pure JS)

## Plugins

Ringa JS integrates with your React application through the **[`react-ringa`](docs/reactRinga.md)** plugin.

## React Components

I am currently in the process of developing a large library of React components based on Ringa. The end goal is to have all the components you could possibly need to build a high-quality React application in one place:

* Tooltips
* Drag and Drop
* List
* Dropdown
* Data Grid
* Modals
* Overlays
* and much, much more

Stay tuned for more information! This should be available by end of 2017.

## Latest Versions

* ringa [<img src="https://img.shields.io/npm/v/ringa.svg"/>](http://www.github.com/joshjung/ringa)

* react-ringa [<img src="https://img.shields.io/npm/v/react-ringa.svg"/>](http://www.github.com/joshjung/react-ringa)

## Minified + GZipped Size

* `ringa`: **~29.5kb**
* `react-ringa`: **2.7kb**

## Comparisons

Ringa JS is an all-in-one solution that can be used alongside your current state management / asynchronous library. However, Ringa is designed to entirely replace your current mix of dozens of libraries and plugins.

In today's world hooking together a collection of small libraries (e.g. one for state management and another for promise management and another for observer pattern, etc.) can be quite frustrating. It is especially frustrating if you know that you will need to train a new developer in your unique mix of code. Ringa JS is designed to alleviate these problems
by giving you all the features you need in one place through a unified framework.

**This chart is subject to update. There are a lot of libraries out there and I may have missed some or their capabilities. If I missed something, let me know! **

Project | State Management | Observer Pattern | Dependency Injection | Asynchronous Tools | Error Handling | Handles DOM Events | Unit Test Ready
:------ |:---------------- |:---------------- | -------------------- |:------------------ |:-------------- |:------------------ | ---------------
Ringa   | **Yes**          | **Yes**          | **Yes**              | **Yes**            | **Yes**        | **Yes**            | Coming Soon
Redux   | **Yes**          | No               | No                   | **Yes** *          | No             | No                 | **Yes**
MobX    | **Yes**          | **Yes**          | No                   | No                 | No             | No                 | **Yes**

\* With plugin usage.

## Requirements

Ringa JS is being developed for an ES6+ development environment (transpiled ES5 artifacts are available).

## Compatibility

* Chrome
* Firefox
* Safari
* IE 11+
* Edge
* Native Node (through use of the Ringa `Bus` instead of DOM nodes)

IE 10 needs work because it does not recognize `__proto__`.

## Installation

* `npm install --save-dev ringa` - Install Ringa JS into your project

## Testing and Coverage

`npm run test`

Ringa JS currently has 208 unit tests to ensure its core features are running smoothly.

Our goal is 100% coverage so there is a little work to do!

<img src="https://i.imgur.com/G564KCy.png" alt="Test Results" style="width: 450px;"/>

## When should I use it?

RingaJS is right for you if you find yourself dealing with:

* Boilerplate Code
* Need seamless integration between components in a large library
* Chains of asynchronous code
* Complicated intercomponent communication
* Complex state managemetn
* Application scalability issues
* Trouble refactoring large portions of your view

### Boilerplate

RingaJS uses very little boilerplate code. 

### Asynchronous Code

RingaJS has an advanced built-in system for hooking chains of complicated asynchronous code together so they talk to eachother seamlessly and have intelligent fallbacks for any error, whether a thrown JS error or an API error.

### Intercomponent Communication

RingaJS lets all controllers in your application talk to eachother by default through DOM elements. This means your controllers are one with your view, while also being able to talk to each other through the natural tree structure of your view.

### State

RingaJS uses dependency injection, the observer pattern, and the natural tree structure of your application for its state management without needing any singletons.

### Scalability

RingaJS's architecture strongly encourages heavy decoupling and reusability of all of your code, from models, to asynchronous code, to your view. This leads to highly scalable code as your program grows.

### Refactoring

RingaJS's structure makes refactoring large swaths of your view, models, or control easy because of its strict use of dependency injection, simple use of the observer pattern, and unique ability to reuse large sections of asynchronous code.

## Background

RingaJS was built in my spare time the last year as a way to shift the most difficult
concepts of rapid application development into a library to improve my own personal development speed. It was also designed as a way to organize enterprise
applications in a way that made it extremely easy to monitor teams as they work in a growing codebase.

## Contributors and Contact

* [Joshua Jung - Project Owner](mailto://joshua.p.jung@gmail.com)
* Thomas Yarnall
* Jimmy Schwarzenberger
* Saajan Sn
* Naomi Mathews
* Marcus Folkeryd

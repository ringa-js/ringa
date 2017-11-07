# Welcome to Ringa JS!

Ringa JS is an enterprise single page application (SPA) framework that provides:

* MV\* Architecture
* State Management
* Observer Pattern
* Dependency Injection
* Asynchronous Toolset
* Error Management
* Single communication paradigm between all components that depends only on the browser
* Core focus on performance, modularity, and scalability
* Zero dependencies on any other frameworks (pure JS)

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

## Plugins

Ringa JS integrates with your React application through the **[`react-ringa`](docs/reactRinga.md)** plugin.

**`react-ringa` is compatible with React 16 Fiber and React 15**.

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

## Testing and Coverage

`npm run test`

Ringa JS currently has 208 unit tests to ensure its core features are running smoothly.

Our goal is 100% coverage so there is a little work to do!

<img src="https://i.imgur.com/G564KCy.png" alt="Test Results" style="width: 450px;"/>

## When should I use it?

RingaJS is right for you if you:

* Hate Boilerplate Code
* Need seamless integration between components in a large library and across various versions
* Want to simplify complex chains of asynchronous code
* Want simple communication between all your components
* Want to break your enterprise application into manageable submodules
* Want to avoid singletons
* Are not sure what your final UX is going to be and want completely painless refactoring next year
* Want to be able to pass your codebase to other developers and have the entire thing be easily understood
* Want to know your application can scale from a prototype to enterprise with little refactoring

## Background

The concepts of Ringa JS were originally developed around 2010 for Adobe Flex and used on a dozen enterprise applications. Since the death of Flash, I had tossed around the idea of rewriting them for Javascript.

I built the current version of Ringa JS in my spare time the last year to improve my own development speed and out of sheer frustration at every single major state and asynchronous library on the market.

So far it is working super well and is highly performant on several large-scale applications. More details to come soon as the project grows!

## Contributors and Contact

If you want to contribute, or want to ask questions, feel free to reach out. As of November, 2017 the project is under heavy active daily development:

* [Joshua Jung - Project Owner](mailto://joshua.p.jung@gmail.com)
* Thomas Yarnall
* Jimmy Schwarzenberger
* Saajan Sn
* Naomi Mathews
* Marcus Folkeryd

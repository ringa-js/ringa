# Welcome to Ringa JS!

Ringa JS is an enterprise single page application (SPA) framework that includes:

1. **MVC / MVVM Hybrid Architecture**
2. **State management** with no singletons
3. Performance centered **Observer Pattern**
4. **Dependency injection to React Components**
5. **Asynchronous toolset** with branching, looping, and error handling
6. Customizable **Error Management**
7. Heavy focus on **performance, modularity, and scalability**

Ringa JS integrates with your React application through the `react-ringa` plugin.

## Latest Versions

### ringa [<img src="https://img.shields.io/npm/v/ringa.svg"/>](http://www.github.com/joshjung/ringa)

### react-ringa [<img src="https://img.shields.io/npm/v/react-ringa.svg"/>](http://www.github.com/joshjung/react-ringa)

## Similar Libraries

RingaJS is an all-in-one solution that can be used alongside your current state management / asynchronous library. However, Ringa can completely replace them.

Similar libraries include:

* MobX
* Redux
* Flux
* Relay

## Size

* `ringa` (minified): **~133kb**
* `react-ringa` (minified): **~8kb**

## Requirements

Right now RingaJS is being developed for an ES6+ development environment (transpiled ES5 artifacts are available) and has been tested on:

* Chrome
* Firefox
* Safari
* IE 10+
* Edge

## Installation

* `npm install --save-dev ringa` - Install Ringa into your project

## Testing and Coverage

`npm run test`

Ringa currently has 208 unit tests to ensure its core features are running smoothly.

Our goal is 100% coverage so there is a little work to do!

<img src="https://i.imgur.com/G564KCy.png" alt="Test Results" style="width: 500px;"/>

## When should I use it?

RingaJS is right for you if you find yourself dealing with:

* Boilerplate Code
* Chains of asynchronous code
* Complicated intercomponent communication
* Strange state problems
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

## Contributors

* Joshua Jung
* Thomas Yarnall
* Jimmy Schwarzenberger
* Saajan Sn
* Naomi Mathews
* Marcus Folkeryd

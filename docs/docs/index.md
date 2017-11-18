# Ringa JS: State and Asynchronous Framework

Ringa JS is a single page application framework designed for ES6+ that provides:

* MV\*
* State Management using observer pattern and dependency Injection
* Composable asynchronous toolset
* Tree-based algorithms for both communication and dependency management

[Click here for an architectural overview](/architecture/iocFPAndRinga.md)

## Stable Versions

* [ringa <img src="https://img.shields.io/npm/v/ringa.svg"/>](http://www.github.com/ringa-js/ringa)
* [react-ringa <img src="https://img.shields.io/npm/v/react-ringa.svg"/>](http://www.github.com/ringa-js/react-ringa)
* [ringa-fw-react <img src="https://img.shields.io/npm/v/ringa-fw-react.svg"/>](http://www.github.com/ringa-js/ringa-fw-react)

## Plugins

Ringa JS integrates with your React application through the **[`react-ringa`](/plugins/reactRinga.md)** plugin.

**`react-ringa` is compatible with React 16 Fiber and React 15**.

## React Component Library

We are currently in the process of developing a large library of React components based on Ringa.

[Demonstration and Documentation](http://react.ringajs.com/)

## Comparisons

Hooking together a collection of numerous libraries can be quite frustrating. Especially if you know that you will need to train a new developer in your unique mix of code. Our goal with Ringa JS to provide everything you need in one place.

**This chart is subject to update. There are a lot of libraries out there and I may have missed some or their capabilities. If I missed something, let me know! **

Project | State Management | Observer Pattern | Dependency Injection | Asynchronous Tools | Error Handling | Listens to DOM Events | Unit Test Ready
:------ |:---------------- |:---------------- | -------------------- |:------------------ |:-------------- |:------------------ | ---------------
Ringa   | **Yes**          | **Yes**          | **Yes**              | **Yes**            | **Yes**        | **Yes**            | Coming Soon
Redux   | **Yes**          | No               | No                   | **Yes** *          | No             | No                 | **Yes**
MobX    | **Yes**          | **Yes**          | No                   | No                 | No             | No                 | **Yes**

\* With plugin usage.

## Compatibility

All major modern browsers are support, starting with IE 11.

## Size

* `ringa`: **~29.5kb gzipped**
* `react-ringa`: **2.7kb gzipped**
* `ringa-fw-react`: **47kb gzipped**

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

# Welcome to RingaJS

## What is it

RingaJS is a single page application framework that includes:

1. **MVC / MVVM hybrid** structure with little boilerplate
2. **State management** with no singletons
3. Performance centered **observer pattern**
4. **Dependency injection**
4. **Asynchronous toolset** with branching, looping, and error handling

It is hard to explain what Ringa is in a single sentence because it just does so much. This was built in my spare time the last year as a way to shift all the most difficult
concepts to rapid application development into a core set of Classes to improve my own development speed. It was also designed as a way to organize large enterprise
applications in a way that made it extremely easy to monitor large teams as they work in a growing codebase.

Ringa's philosophy can be summed up with a few mantras:

* Shield new developers from concepts they do not need to know... yet
* Let seasoned developers configure or extend anything
* Give everyone easy to understand error messages and warnings
* Never sacrifice performance
* No fancy string parsing for observers
* Give developers 100% control over their observables

## Latest Version

The latest version is `0.1.0` Alpha.

RingaJS is currently in Alpha version and has been so since Janary 2017, and while being used live, has not been battle-tested on a large scale quite yet. We would
love your input and your bug reports.

## Requirements

Right now RingaJS is being developed for an ES6+ development environment and has been tested on:

* Chrome
* Firefox
* Safari
* IE 11+

## Installation

* `npm install --save-dev ringa` - Install Ringa into your project

## Testing

Ringa currently has around 200 unit tests to ensure its core features are running smoothly. Test can be run with:

`npm run test`

My personal goal is 100% coverage so there is a little work to do! Results as of Oct. 9th, 2017 are:

![Test Results](https://i.imgur.com/G564KCy.png)

## License

MIT


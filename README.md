[<img src="http://www.jungdigital.com/public/ringa/logo/ringa.png" width="250">](http://demo.ringajs.com)

* ringa [<img src="https://img.shields.io/npm/v/ringa.svg"/>](http://www.github.com/ringa-js/ringa)
* react-ringa [<img src="https://img.shields.io/npm/v/react-ringa.svg"/>](http://www.github.com/ringa-js/react-ringa)
* ringa-fw-react [<img src="https://img.shields.io/npm/v/ringa-fw-react.svg"/>](http://www.github.com/ringa-js/ringa-fw-react)

## Installation

Right now Ringa JS is only used inside React applications, so you will almost always install it alongside the react plugin:

    npm install -S ringa
    npm install -S react-ringa

## Getting Started

* [Hello World Tutorial](http://ringajs.com/gettingStarted/helloWorld/)
* [Blank React Application Template](https://github.com/ringa-js/ringa-app-template)
* [Chuck Norris Joke Loader](https://github.com/ringa-js/ringa-example-chuck-norris)
* [TodoMVC](https://github.com/Saajan/ringa-todomvc)

## Links

* **[Documentation](http://www.ringajs.com)**
* **[Trello-like Demo](http://demo.ringajs.com)**
* **[React Component Demo](http://react.ringajs.com)**

## Testing

    npm run test

* Coverage with Jest (208 unit tests so far and counting)

## Development

This project is under heavy active development and while being heavily tested is still considered Alpha.

## Documentation

Documentation is built using MKDocs and stored in the `docs` folder.

To edit the documentation with live reload, navigate to the folder and do:

    mkdocs serve
    
When done editing, you can build the docs from the root via `npm run docs`.

If you are having issues building, note that you must use an older version of MKDocs right now to use the Cinder template
we are currently using:

    pip install 'mkdocs<0.15.3' 

# License

MIT License (c) 2017 by Joshua Jung, Thomas Yarnall, and the Ringa Team

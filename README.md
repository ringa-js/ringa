# ringa

Ringa is an extensible ES6 framework designed to help you build highly debuggable Javascript applications. It works on both the browser and server.

Designed for small and enterprise solutions alike, Ringa includes:

* Tree structured event busses
* Asynchronous executor trees (e.g. Promises)
* Model and property watching
* Detailed debugging output

Ringa has all you need to ensure that your asynchronous executor trees, model injections, and separation of concerns do not slow down development as your project grows in size.

*Note: this project is still in Alpha and will be released February, 2017.*

# get started

    npm install ringa

# demo

A full demo with API is under development at [ringa-example-react](https://github.com/jung-digital/ringa-example-react).

It will be deployed end of February, 2017 for you to play around with, and will demonstrate all the features of Ringa in a functioning application in the style of Trello.

# nomenclature

* Controller: an object that maps events to asynchronus executor trees
* Executor: any asynchronous code (callback, Promise, async/await, etc.)

# web example

The following example illustrates a few of the important features available in Ringa:
 
* Controller and Executors
* Async Task Tree
* Model watching
* Injection


    import {Controller, Model, dispatch, while} from 'ringa';

    class CountModel extends Model {
      constructor() {
        this.addProperty('count', 0);
      }
    }
    
    class BlastoffController extends Controller {
      constructor() {
        // Attach to document
        super('Blastoff Controller', document);

        // Add a model, accessible and injectable by its name which by default is a camelcase of its Class name
        this.addModel(new CountModel()); 

        // 1) inject 'countModel'
        // 2) inject 'millis' by name from the dispatched events detail object
        // 3) provide a 'done' and 'fail' callback (function could also return a Promise)
        const decrement = (countModel, millis, done) => {
          setTimeout(() => {
            countModel.count--;

            done();
          }, millis);
        };

        // Creates BlastoffController.RUN_COUNTDOWN
        this.addListener('runCountdown', [
          (countModel, startMessage, total) => {
            console.log(startMessage);

            countModel.count = total;
          },
          while(countModel => countModel.count > 0, decrement),
          (finalMessage) => {
            console.log(finalMessage);
          },
        ]);
      }
    }
    
    let controller = new BlastoffController();

    // Watch our model and wait for the notification event 'count'
    controller.watch('myModel', 'count', count => {
      console.log(count); // 5, 4, 3, 2, 1, 0...
    });

    // Kick everything off with a single event!
    dispatch(BlastoffController.RUN_COUNTDOWN, {
      startMessage: 'Starting Countdown...',
      finalMessage: 'Blastoff!',
      total: 5
      millis: 1000
    }, document);

**Output**

Output counts down every second:

    Starting Countdown...
    5
    4
    3
    2
    1
    0
    Blastoff!

# architecture

**Controllers**

* Attach to DOM nodes (or busses on the server)
* Can use DOM events for communication (bubble, capture, stopPropagation, etc.)
* Manage asynchronous code in clean, readable trees of executors
* Rollback of each completed executor in the tree if an executor fails or is cancelled (COMING SOON)

**Asynchronous Task Trees**

* Tasks can be Promises, Ringa commands, functions, dispatch of a new Ringa Event, or your own customization
* Arguments are injected into executors by argument name (similar to AngularJS)
* Tasks can add new properties to the event details to be injected into the next executors
* Tasks can be run in parallel or sequentially

**Models**

* Can be watched (e.g. to update the view)
* Watching is customizable by event to improve specificity and therefore performance
* Watch notifications are batched and sent at once so your watchers do not get spammed for every change in the model

**Ringa Events**

* Ringa events function like promises with `then` and `catch` support so you get notified when a full asynchronous task tree has completed

**Debugging (Dev mode only)**

* Ringa Events contain debugging information of the entire executor tree they triggered
* Ringa events contain the stack trace of where they were dispatched
* Highly specific errors are logged or thrown when you forget to use Ringa objects properly
* Ringa lets you know when you forget to pass a property to your executor tree

# support

* Dependency Injection to ReactJS Components (through the [react-ringa](https://github.com/jung-digital/react-ringa) project) (COMING SOON)
* Promises
* async/await

# tested

* 100% Coverage with Jest (COMING SOON)

# development

This project is under active development, along with the following support projects:

* [react-ringa](https://github.com/jung-digital/react-ringa)
* [ringa-example-server](https://github.com/jung-digital/ringa-example-server)
* [ringa-example-react](https://github.com/jung-digital/ringa-example-react)

# license

MIT License (c) 2017 by Joshua Jung

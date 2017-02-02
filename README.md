# ringa

Ringa is a highly extensible ES6 MVC-inspired library designed to help you build scalable and highly debuggable applications.

*Note: this project is still in Alpha and will be released February, 2017.*

# install

    npm install ringa

# features

**Controllers**

* Attach to DOM nodes (or simulated ones)
* Use DOM events for communication (bubble, capture, stopPropagation, etc.)
* Manage asynchronous code in clean, readable trees of tasks
* Rollback of each completed task in the tree if a task fails or is cancelled (COMING SOON)

**Asynchronous Task Trees**

* Tasks can be Promises, Ringa commands, functions, dispatch of a new Ringa Event, or your own customization
* Arguments are injected into tasks by argument name (similar to AngularJS)
* Tasks can add new properties to the event details to be injected into the next tasks
* Tasks can be run in parallel or sequentially (COMING SOON)

**Models**

* Can be watched (e.g. to update the view)
* Watching is customizable by event to improve specificity and therefore performance
* Watch notifications are batched and sent at once so your watchers do not get spammed for every change in the model

**Ringa Events**

* Ringa events function like promises with `then` and `catch` support so you get notified when a full asynchronous task tree has completed

**Debugging (Dev mode only)**

* Ringa Events contain debugging information of the entire task tree they triggered
* Ringa events contain the stack trace of where they were dispatched
* Highly specific errors are logged or thrown when you forget to use Ringa objects properly
* Ringa lets you know when you forget to pass a property to your task tree

**Extensible**

* Classes in Ringa are easily extended and designed to be customized

# demo

A full demo with API is under development at [ringa-example-react](https://github.com/jung-digital/ringa-example-react).

# example

    import {Controller, Model, dispatch} from 'ringa';

    class CountModel extends Model {
      set count(value) {
        this._count = value;
        
        this.notify('countChanged');
      }
      
      get count() {
        return this._count;
      }
    }
    
    class BlastoffController extends Controller {
      constructor() {
        super('Blastoff Controller', document); // Attach to document (DOM node)

        this.addModel(new CountModel('countModel')); // Add a model, accessible and injectable by its id

        // 1) inject 'countModel'
        // 2) inject 'millis' by name from the dispatched events detail object
        // 3) provide a 'done' and 'fail' callback (function could also return a Promise)
        let decrement = (countModel, millis, done, fail) => {
                            setTimeout(() => {
                              countModel.count--;

                              if (countModel.count < 0) {
                                fail('Uh oh, countdown failed!');
                              }

                              done();
                            }, millis);
                          };

        // Automatically creates BlastoffController.RUN_COUNTDOWN
        this.addListener('runCountdown', [
          (countModel, startMessage) => {
            console.log(startMessage);

            countModel.count = 5;
          },
          decrement,
          decrement,
          decrement,
          decrement,
          decrement,
          (finalMessage) => {
            console.log(finalMessage);
          },
        ]);
      }
    }
    
    let controller = new BlastoffController();

    // Watch our model by its model id and wait for the notification event 'countChanged'
    // 'count' is injected by name, but we could inject other model properties too
    controller.watch('myModel', 'countChanged', (count) => {
      console.log(count); // 5, 4, 3, 2, 1, 0...
    });

    dispatch(BlastoffController.RUN_COUNTDOWN, {
      startMessage: 'Starting Countdown...',
      finalMessage: 'Blastoff!',
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

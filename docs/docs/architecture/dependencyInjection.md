# Dependency Injection

*Note: make sure you have read and understand everything in the [Hello World Tutorial](/gettingStarted/helloWorld/) before proceeding.*
 
Ringa JS has two types of dependency injection:

* Function argument injection by name
* View `Model` injection through `react-ringa`

## 1. Function Argument Injection

There are several rules that are followed when performing all function injections in Ringa JS:

* Function injection always injects by name
* Order of arguments does not matter
* Ringa JS will always warn you in the console if a property could not be found for injection

Limitations:

* You cannot currently use defaults (e.g. `(f = 0) => {}`) when performing injections due to the various ways that different transpilers treat this code. I spent a good 4-6 hours trying to figure out how to do this and gave up.

### 1.1. Executor Event Detail Injection

    import {Controller} from 'ringa'

    class MyController extends Controller {
      constructor(name, options) {
        super(name, options);
        
        this.addListener('saySomething', (message) => {
          console.log(message);
        });
      }
    }
    
    ...
    
    import {dispatch} from 'ringa';
    
    dispatch('saySomething', {
      message: 'I will be injected!'
    }, document);
    
You will notice that the property has been injected by its name `message`.

Every key in the detail object is available for injection in every executor.

### 1.2. Executor `Model` Injection

As we have seen in 1.2, executors can request `RingaEvent` details be injected by their name. Executors can request `Model` objects be injected by name as well. 

Please note that all Ringa JS `Model` instances by default have their `name` set to the camelcase of their class name. As a result, when
you create and add a `Model` to a `Controller`, that model can be injected by its default name. For example, if your model is named `CarModel` you can
use `addModel` to attach the model to your Controller and then inject it by its default camelcase name `carModel`.

    import {Controller, Model} from 'ringa'

    const CarModel = Model.construct('CarModel', ['brand', 'type', 'color', 'state']);
    const DriverModel = Model.construct('CarModel', ['name', 'skill']);
    
    class CarController extends Controller {
      constructor(name, options) {
        super(name, options);
        
        this.addModel(new CarModel());
        this.addModel(new DriverModel('Joshua'));
        
        this.addListener('startDriving', (carModel) => {
          carModel.state = 'driving';
        });
        
        this.addListener('brakeSuddenly', (carModel, Joshua) => {
          if (Joshua.skill === 0) {
            carModel.state = 'crashed';
          } else {
            carModel.state = 'stopped';
          }
        });
      }
    }

In this example, we see that `carModel` and `Joshua` can be injected easily by either the default name or the custom name.

### 1.3. Event Chaining and Injections

In Ringa JS, one `Controller` executor chain can trigger another. When this happens, all the injections that were available in the original dispatched event are also available in the secondary dispatched event:

    import {Controller, Model, event} from 'ringa'
    
    class ConsoleController extends Controller {
      constructor(name, options) {
        super(name, options);
        
        // Ringa JS automatically creates ConsoleController.LOG
        this.addListener('log', message => {console.log(message);});
      }
    }
    
    class MessageController extends Controller {
      constructor(name, options) {
        super(name, options);
        
        // Ringa JS automatically creates MessageController.SAY_SOMETHING
        this.addListener('saySomething', event(ConsoleController.LOG));
      }
    }
    
    ...
    
    // Assuming the above controllers have been attached to the document...
    dispatch(MessageController.SAY_SOMETHING, {
      message: 'Woohoo, this gets passed through to ConsoleController!'
    }, document);

One huge architectural advantage of this system is that controllers can function as interfaces to other generic implementations.

But what if there is a name collision somewhere in the chain, like this:

    import {Controller, Model, event} from 'ringa'
        
    class ConsoleController extends Controller {
      constructor(name, options) {
        super(name, options);
        
        this.addListener('log', (message, $ringaEvent, $lastEvent) => {
          console.log(message);                       // Message 2!
          console.log($ringaEvent.lastEvent.detail.message); // Message 1!
          console.log($lastEvent.detail.message);            // Message 1!
        });
      }
    }
    
    class MessageController extends Controller {
      constructor(name, options) {
        super(name, options);
        
        this.addListener('saySomething', event(ConsoleController.LOG, {
          message: 'Message 2!' // Uh oh, the name 'message' collides with our 'message' below!
        }));
      }
    }
    
    ...
    
    // Assuming the above controllers have been attached to the document...
    dispatch(MessageController.SAY_SOMETHING, {
      message: 'Message 1!'
    }, document);

Ringa JS always retains all contextual information even in a naming conflict. If you dispatch an event that overrides a name that was provided in the original event you can still access the original variable through either `$ringaEvent.lastEvent` or `$lastEvent`.

### 1.4. Promise Injection

Every time you call `dispatch()` a `RingaEvent` object is created and returned. The `RingaEvent` object functions like a promise and you can request injections in your `then` or `catch`:

    import {Controller, Model, event} from 'ringa'
    
    const UserModel = Model.construct('UserModel', ['name']);
    
    class UserController extends Controller {
      constructor(name, options) {
        super(name, options);
        
        this.addModel(new UserModel());
        
        this.addListener('getUser', [
          // Do some complex server call
        ]);
      }
    }
    
    ...
    
    // userModel is injected because it exists on the handling controller
    dispatch(UserController.GET_USER, {}, document).then(userModel => {
      console.log(`${userModel.name} has been successfully retrieved!`);
    });

### 1.5. Built in Injections

Ringa JS by default provides several built-in variables that can be injected at any time:

* **`$controller`**: The controller that caught and is currently handling the event.
* **`$thread`**: The internal thread object that is currently managing the executors for the event.
* **`$ringaEvent`**: The original `RingaEvent` that was dispatched.
* **`event`**: If a DOM event (like `click` or `mouseover`) triggered the executor chain, then this would be the DOM event. Note that all DOM events that are caught by Ringa `Controller` are wrapped in a `RingaEvent` before the executors are run.
* **`$lastEvent`**: If one `RingaEvent` chain triggers another (e.g. by using `event()`) then you can access the prior events via `$lastEvent`. These are chained together so if an event triggers 3 executor chains, then `$lastEvent.lastEvent.lastEvent` would be valid.
* **`$customEvent`**: Accesses the DOM `CustomEvent` object that is used to dispatch the `RingaEvent` through the DOM nodes.
* **`$target`**: The target DOM node that dispatched the event.
* **`$detail`**: The event detail object. Useful if you want to add new properties or for some reason cannot inject the properties by name.
* **`done`**: Only available in a function executor. A function to call when the executor has been completed. Similar to `Mocha` or `Jest` unit tests.
* **`fail`**: Similar to done, except triggers a failure of the executor chain.
* **`stop`**: Useful for debugging. Stops the executor and outputs information to the console, where you can start the executor chain again.
* **`resume`**: Resume the executor chain.
* **`$lastPromiseResult`**: If *any* previous executor returned a promise that completed, the result will be contained here.
* **`$lastPromiseError`**: If *any* previous executor returned a promise that errored, the error will be contained here.

### 1.6. Custom Injections

Custom injection values can be added easily to the `options.injections` object:

    import {Controller, Model, event} from 'ringa'
    
    class DudeController extends Controller {
      constructor(name, options) {
        super(name, options);
        
        this.options.injections.someCustomValue = 'I just have to find a cash machine...';
        
        this.addListener('doSomething', ...);
      }
    }
    
    ...
    
    dispatch(DudeController.DO_SOMETHING, {}, document).then(someCustomValue => {
      console.log(someCustomValue);
    });
    
### 1.7. Preparing for Production (Uglify)

When preparing production code, your variable names will be uglified. As a result, you need to add the list of injected variable names to the blacklist for `UglifyJS`:

    plugins: [
      new webpack.DefinePlugin({
        __DEV__: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        mangle: {
          except: [
            '$controller',
            '$thread',
            '$ringaEvent',
            'event',
            '$customEvent',
            '$lastEvent',
            '$target',
            '$detail',
            'done',
            'fail',
            '$lastPromiseResult',
            '$lastPromiseError'
            ...]
        }
      })
    ]
    
But how do you know what they are?

When in `__DEV__: true` mode, Ringa JS keeps track of every single variable that has been injected and builds a whilelist for you.

**To view all the injections you need to add to the `mangle` property of `UglifyJS`, after you have run your application and all of its various executors go to the browser console:**

<img src="/img/uglifywhitelist.png" alt="ringaDebug().uglifywhitelist" style="width: 100%;"/>

Please note that because a lot of the injections that can occur in Ringa JS are dynamic, it is impossible to know before running each executor which variable names will need to avoid mangling.

## 2. View Injection (`react-ringa`)
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
    const DriverModel = Model.construct('DriverModel', ['name', 'skill']);
    
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

In Ringa JS, one `Controller` executor chain can trigger another. When this happens, all the injections that were available in the original dispatched event are also available in the executors responding to the secondary dispatched event:

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

When using React via the `react-ringa` plugin, there are several ways that a React Component can request a `Model` instance to be injected:

Make a `Model` available for injection:

* `attach(component, model)`: use when you want to directly attach a `Model` instance to a Component. This will make the `Model` **available** to the Component and all its descendants for injection. This does not do the injection directly.

Request a `Model` to be injected into a Component's `state`:

1) `depend(component, dependencies[])`: use when you expect an ancestor to provide a `Model` and need to watch its properties and have them injected. If properties are injected, `depend` ensures that the `state` of the React Component accurately reflects any changes in the `Model`.
2) `watch(component, model, properties = [])`: if you already have access to the `Model` instance, you can use watch instead of `depend()`.

### 2.1. Attach a `Model` to a Component

`attach(component, controllerOrModel)`

All `Model` instances are attached to a React `Component` via a Ringa JS `Controller`:

#### Attach Example 1

To attach a `Model` directly to a React Component and make it available to be injected to the Component and all its descendants, you can simply do:

    import {Model} from 'ringa'
    import {attach} from 'react-ringa';
    
    const UserModel = Model.construct('UserModel', ['firstName', 'lastName']);
    
    class UserContainer extends React.Component {
      constructor(props) {
        super(props);
        
        attach(this, new UserModel());
      }
    }

#### Attach Example 2

If you wish to attach the `Model` via a `Controller` you can do so like this:

    import {Model} from 'ringa'
    import {attach} from 'react-ringa';
    
    const UserModel = Model.construct('UserModel', ['firstName', 'lastName']);
    
    class UserController extends Controller;
    
    class UserContainer extends React.Component {
      constructor(props) {
        super(props);

        let userController = new UserController();

        userController.addModel(new UserModel());

        attach(this, userController);
      }
    }

### 2.2. Request a `Model` Dependency Injection from a Component

`depend(component, dependencies[])`

This function searches for instances that match its list of dependencies, injects them into the React `Component` `state`, and watches any properties on those instances for changes and intelligently refreshes the view when changes happen.

Note that when requesting dependencies, Ringa JS is smart enough to look for the closest matching `Model` that matches the type you request.

The closest `Model` is defined as:

* **Request by type**: a `Model` that is attached to the current Component or its nearest ancestor that is itself of the type requested or extends the type requested.
* **Request by name**: a `Model` that is attached to the current Component or its nearest ancestor that has the name requested.

*Note: Ringa JS will give you a warning when in `__DEV__: true` mode if it encounters more than one Model that matches your requested dependency so that you can resolve this conflict if necessary.*

`depend()` is the closest concept to binding that exists in Ringa JS. However, unlike other binding frameworks, Ringa JS provides considerable control over when updates take place and helps to ensure that there are no performance bottlenecks.

#### Example 1 Request by Type

    import {Model} from 'ringa'
    import {attach, depend, dependency} from 'react-ringa';

    const UserModel = Model.construct('UserModel', ['firstName', 'lastName']);

    class User extends React.Component {
      constructor(props) {
        super(props);

        depend(this, dependency(UserModel, ['firstName', 'lastName']));
      }

      render() {
        return <div>{this.state.firstName} {this.state.lastName}</div>;
      }
    }
    
    class UserContainer extends React.Component {
      constructor(props) {
        super(props);
        
        attach(this, new UserModel());
      }
      
      render() {
        return <User />;
      }
    }
    
#### Example 1 Request by name

    import {Model} from 'ringa'
    import {attach, depend, dependency} from 'react-ringa';
    
    const UserModel = Model.construct('UserModel', ['firstName', 'lastName']);
    
    class User extends React.Component {
      constructor(props) {
        super(props);

        depend(this, dependency('someCustomUserModelName', ['firstName', 'lastName']));
      }

      render() {
        return <div>{this.state.firstName} {this.state.lastName}</div>;
      }
    }
    
    class UserContainer extends React.Component {
      constructor(props) {
        super(props);
        
        attach(this, new UserModel('someCustomUserModelName'));
      }
      
      render() {
        return <User />;
      }
    }

Architectural benefits to this approach:

* There is no need to pass properties to children
* Each Component is responsible for determining when it needs to update itself
* Build all your view components and wire them up after the fact
* Easy to provide custom injections for unit tests
* Split your large application into submodules and the child modules do not need to know anything about the parent in order to request injections
* Move view components around easily without having to worry about touching ancestors
* No singletons or god objects
    
### 2.3. Watch a specific `Model` instance on a Component

`watch(component, model, properties = [])`

In some cases, you may already have access to a `Model` instance and want to immediately watch it so that the view refreshes when a property on the `Model` changes:

    import {Model} from 'ringa'
    import {watch} from 'react-ringa';
    
    const PlaneModel = Model.construct('PlaneModel', ['altitude', 'speed']);
    
    class Plane extends React.Component {
      constructor(props) {
        super(props);
        
        this.planeModel = new PlaneModel();
        
        watch(this, this.planeModel, ['altitude', 'speed']);
      }

      render() {
        const {altitude, speed} = this.state;
        
        return <div>
          <span>Altitude: {altitude}</span>
          <span>Speed: {speed}</span>
          <button onClick={this.fasterAndHigher_onClickHandler}>Go faster and higher!</button>
        </div>;
      }

      fasterAndHigher_onClickHandler() {
        this.planeModel.altitude += 10;
        this.planeModel.speed++;
      }
    }
    
In the above example, when `altitude` or `speed` change, those properties are automatically watched and the view is refreshed.

Note that Ringa JS is smart enough to only perform one view refresh even though two properties are being updated.

### 2.4. Ringa JS and React Performance

By default, React does an incredibly good job of ensuring that only DOM nodes are updated that need to be. However, because React was built from the ground up to expect that parents will pass properties to their children, if you are passing all properties to children and one of those properties changes, then this will trigger a call to `render()` on all of the children that see the property has changed - even if they do not themselves need to be re-rendered.

Thankfully React 16 has made a ton of improvements to ensure that the lifecycle of Component updates is top-notch. The new scheduling paradigm has made things even better.

Ringa JS naturally integrates with React because of the unique way it tells React when to rerender a Component.

Whenever you `depend` or `watch` in Ringa JS and a watched property changes, the property is added to a batch of properties to be updated the next frame via `setState`. As a result you could watch dozens of properties and set all of them and only one `setState` would be called by Ringa.

In addition, because each Component is responsible for saying what `Model` it needs and exactly which properties should trigger an update, parent components do not need to hold the responsibility of changing properties on their children to trigger a redraw.

We have discovered that Ringa JS works insanely fast with React (both 15 and 16) with literally thousands of React Components and bindings on the screen at once and only takes milliseconds to do large updates.

All of that said, performance bottlenecks still happen. Ringa JS has a built in warnings when it encounters performance issues. In addition every step of the process from setting a property on a `Model` to how it updates the display can be customized for maximum leverage over your applications lifecycle. 



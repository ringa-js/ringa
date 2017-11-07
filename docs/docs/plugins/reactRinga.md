# `react-ringa` Plugin

## 1. Overview

The primary purpose of the `react-ringa` plugin is to assist in dependency injection of `Model` objects to your React Components and to intelligently rerender them when dependencies change.

## 2. Dependency Injection

When using React via the `react-ringa` plugin, there are a couple ways that a React Component can access to (and watch) a Ringa JS `Model` instance.

First you will want to make a `Model` available for injection:

* `attach(component, model)`: use when you want to directly attach a `Model` instance to a Component. This will make the `Model` **available** to the Component and all its descendants for injection. This does not do the injection directly.

Request a `Model` (or its properties) to be injected into a Component's `state` in one of two ways:

1. `depend(component, dependencies[])`: use when you expect an ancestor to provide a `Model` and need to watch its properties and have them injected. If properties are injected, `depend` ensures that the `state` of the React Component accurately reflects any changes in the `Model`.
2. `watch(component, model, properties = [])`: if you already have access to the `Model` instance, you can use watch instead of `depend()`.

### 2.1. Attach a `Model` to a Component

`attach(component, controllerOrModel)`

All `Model` instances are attached to a React `Component` via a Ringa JS `Controller`:

#### `attach()` Example 1 Direct to Model

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

#### `attach()` Example 2 Via Controller

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

Note that when you use `depend()` the requested `Model` is added to the components `state` by its name.

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

Notes:

* If you do not provide any dependencies, then every property on the `Model` is watched.
* If your `Model` is structured in a tree, you can watch children models by using dot-syntax (e.g. `depend(this, dependency(AppModel, ['user.firstName']))`)
* If your `Model` is structured in a tree, you can watch children models and all of their properties by using star syntax (e.g. `depend(this, dependency(AppModel, ['user.*']))`)

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

### 2.4. Performance

By default, React does an incredibly good job of ensuring that only DOM nodes are updated that need to be. However, because React was built from the ground up to expect that parents will pass properties to their children, if you are passing all properties to children and one of those properties changes, then this will trigger a call to `render()` on all of the children that see the property has changed - even if they do not themselves need to be re-rendered.

Thankfully React 16 has made a ton of improvements to ensure that the lifecycle of Component updates is top-notch. The new scheduling paradigm has made things even better.

Ringa JS naturally integrates with React because of the unique way it tells React when to rerender a Component.

Whenever you `depend` or `watch` in Ringa JS and a watched property changes, the property is added to a batch of properties to be updated the next frame via `setState`. As a result you could watch dozens of properties and set all of them and only one `setState` would be called by Ringa.

In addition, because each Component is responsible for saying what `Model` it needs and exactly which properties should trigger an update, parent components do not need to hold the responsibility of changing properties on their children to trigger a redraw.

We have discovered that Ringa JS works insanely fast with React (both 15 and 16) with literally thousands of React Components and bindings on the screen at once and only takes milliseconds to do large updates.

All of that said, performance bottlenecks still happen. Ringa JS has a built in warnings when it encounters performance issues. In addition every step of the process from setting a property on a `Model` to how it updates the display can be customized for maximum leverage over your applications lifecycle. 



# Getting Started

This tutorial will walk you through, step by step, how to:

1. Build a Ringa Model
2. Build a Ringa Controller
3. Attach a Ringa controller to your view
4. Inject your model into React view Components
5. Refresh a Component when a property on the Model changes
6. Quickly, and Painlessly, Refactor our View
7. Dispatch and Handle an Events and trigger an asynchronous chain of code

## Setting Up Your Workspace

First, you will want to download and install the **[RingaJS Application Template](https://github.com/joshjung/ringa-app-template)**.

Once you have this running per the `Readme.md` instructions, you can continue!

*Note: you may want to fork the repository or clear out the .git references until we have built a Yeoman generator or something similar.*

## 1. Building a Ringa `Model`

To construct a Ringa Model, you just need to extend `Model` and add some properties:

    import {Model} from 'ringa';
    
    class HelloWorldModel extends Model {
      constructor(name, values) {
        super(name, values);
        
        this.addProperty('helloWorldText', 'Hello World!');
      }
    }

Or, if you want to use the shorthand:

    const HelloWorldModel = Model.construct('HelloWorldModel', [{
      name: 'helloWorldText',
      default: 'Hello World!'
    }]);

Under the hood, Ringa creates custom getters and setters for each property on your model. In addition
it can store custom options for each property. These getters, setters, and options allow Ringa to perform
its fancy magic.

## 2. Building a Ringa `Controller`

Controllers in Ringa link Models to your view. They also link Models to your control / asynchronous code. In many ways the Controllers in Ringa work like a traditional MVC controller (with a couple major game-changing differences which we will explain later).

In any case, here is a basic example of a bare-bones Controller that does virtually nothing:

    import {Controller} from 'ringa';
    
    class HelloWorldController extends Controller {
      constructor(name, bus, options) {
        super(name, bus, options);
        
        this.addModel(new HelloWorldModel());
      }
    }
    
This controller really does not do much. It simply "holds" a reference to a single instance of our super fancy and magical hello world model.

It's really okay if you are not impressed yet.

## 3. Attach a `Controller` to your view

*Note: Ringa does not depend on React, but in the current version React is the only plugin being developed so you must suffer if you love Vue or something. But quite frankly after seeing how well Ringa works with React at keeping things clean, you might give up your current framework.*

And now, let us attach our beautiful Controller to an equally vapid React Component:

    import {attach} from 'react-ringa';
    
    class HelloWorld extends React.Component {
      constructor(props) {
        super(props);
        
        attach(this, new HelloWorldController());
      }
      
      render() {
        return <div>This doesn't really do anything.</div>;
      }
    }
    
At this point we are nearly 90% of the way to recreating Facebook! Pat yourself on the back.

## 4. Inject your `Model` into the View

One of the most powerful features of Ringa, and in particular `react-ringa`, is that a view component can request any Model by its type or its name. `react-ringa` will look
through its parent hierarchy for all controllers, and ask those controllers if they have an instance of the requested `Model`. If they do, the one *closest* to the current Component is returned:

    import {depend, dependency} from 'react-ringa';
    
    class HelloWorld extends React.Component {
      constructor(props) {
        super(props);
        
        depend(this, dependency(HelloWorldModel)); // Ask for an instance of HelloWorldModel
        
        attach(this, new HelloWorldController()); // Attach the Controller (which has the instance)
      }
      
      render() {
        return <div>This starting to do something...</div>;
      }
    }
    
In this case, our `HelloWorld` component will search for the first instance of `HelloWorldModel` that it can find. First it looks for all Ringa Controllers within itself or its ancestors. It finds `HelloWorldController`, attached to itself like a barnacle. Then it searches
through all of the available `Models` that are added to those Controllers (in our case only the `HelloWorldController`). It returns the first one it finds... the one that is closest in the view stack to the current Component. In this case it finds our instance of `HelloWorldModel` that
we added to our `HelloWorldController`.

When Ringa finds a matching `Model` it uses the name of the `Model` and injects that into the Component's state object:

    import {depend, dependency} from 'react-ringa';
        
    class HelloWorld extends React.Component {
      constructor(props) {
        super(props);
        
        // Note that all Ringa Models by default have a name that is the camelcase
        // of the Class name, so this would be named 'helloWorldModel'
        depend(this, dependency(HelloWorldModel));
        
        attach(this, new HelloWorldController());
      }
      
      render() {
        // Here our instance has been injected into the state
        const {helloWorldModel} = this.state;
        
        return <div>{helloWorldModel.helloWorldText}</div>;
      }
    }

You may ask why we inject into `state` and not `props`. This was a complicated decision. Some other frameworks like Redux get around the immutability of `props` by wrapping every single component that uses `connect` with *another* React Component so they can inject the `store`.

I just personally decided this felt silly to wrap every component in another component to work around a design decision and `state` worked so I ran with it. We can discuss the philosophical ramifications of this decision later but for now it works super well.

## 5. Refresh the Display When a Property Changes on a Model

Now, clearly displaying hello world is not enough. We may, in fact, need at some point to say goodbye to the world. Perhaps it is because it is covered in a dense layer of Venusian gasses and infected with a wildly popular orange alien who keeps spewing them.

Whatever your personal reasons may be for leaving this planet, Ringa makes it easy (in this particular example):

    import {depend, dependency} from 'react-ringa';
        
    class HelloWorld extends React.Component {
      constructor(props) {
        super(props);
        
        depend(this, dependency(HelloWorldModel, 'helloWorldText'));
        
        attach(this, new HelloWorldController());
      }
      
      render() {
        // Now the property *and* the model are injected into state.
        const {helloWorldText} = this.state;
        
        return <div>
          {helloWorldText}
          <button onClick={this.goodbyeWorld}>Hej Då!</button>
        </div>;
      }
      
      goodbyeWorld() {
        this.state.helloWorldModel.helloWorldText = 'Goodbye, earth!';
      }
    }

After close scrutiny you might have noticed that in this example we are now watching, specifically, the `helloWorldText` property on our model. What this means is that whenever that property changes, we force the component to rerender itself and inject that property
into the state object.

## 6. Quick, and Painless, Refactoring our View

At this point, you may wonder what all the fuss is about. You see, Ringa's power does not lie just in its low boilerplate, intuitive dependency injection, or fast observer pattern. It lies in the flexibility of restructuring your view on the fly while having to adjust the least amount of code. Moving things around and refactoring your view
is insanely easy:

    class HelloWorldText extends React.Component {
      constructor(props) {
        super(props);
        
        depend(this, dependency(HelloWorldModel, 'helloWorldText'));
      }
      
      render() {
        const {helloWorldText} = this.state;
        
        return <div>{helloWorldText}</div>;
      }
    }

    class HelloWorld extends React.Component {
      constructor(props) {
        super(props);
        
        attach(this, new HelloWorldController());
      }
      
      render() {
        const {helloWorldText} = this.state;
        
        return <div>
          <HelloWorldText /> // <--- Take a look here
          <button onClick={this.goodbyeWorld}>Go to Mars with Elon Musk</button>
        </div>;
      }
      
      goodbyeWorld() {
        this.state.helloWorldModel.helloWorldText = 'Goodbye, earth!';
      }
    }
    
But wait, how... how does `HelloWorldText` know what instance of the `HelloWorldModel` it is supposed to use?

Note the `Take a look here` comment. On that line, we create an instance of `HelloWorldText`. The ancestor of that instance (`HelloWorld`) contains a Controller that has an instance of our `HelloWorldModel`. So `depend` easily finds an instance to inject!

While at first this may be confusing, it naturally allows you to structure the tree of your view in a highly reusable and scalable way.

## 7. Dispatching and Handling Asynchronous Events

Setting properties on Models is great and all, but our application does - at some point - need to actually do something. And nobody is going to buy that our trip to mars only took like 0 milliseconds.

First, we need to update our Controller so that it can receive events:

    import {Controller} from 'ringa';
    
    class HelloWorldController extends Controller {
      constructor(name, bus, options) {
        super(name, bus, options);
        
        this.addModel(new HelloWorldModel());
        
        this.addListener('goToMars', [
          this.updateMessage('Traveling to Mars!'),
          1000, // Wait 1000 ms
          this.updateMessage('Getting really bored...'),
          5000, // Wait 5000 ms
          this.updateMessage('Perhaps hibernation should have been invented.'),
          10000, // Wait 10000 ms
          this.updateMessage('Finally, we have arrived!!'),
        ]);
      }
      
      updateMessage(text) {
        return (helloWorldModel) => {
          helloWorldModel.helloWorldText = text;
        };
      }
    }

Second, we are going to create create Form and have it dispatch an event:

    import {dispatch} from 'ringa';
    
    class HelloWorldForm extends React.Component {
      constructor(props) {
        super(props);
      }
      
      render() {
        return <button ref="button" onClick={() => {this.onClick()}}>Blast off!</button>;
      }
      
      onClick() {
        dispatch(HelloWorldController.GO_TO_MARS, {}, this.refs.button);
      }
    }
    
And that is it! Dispatching in Ringa dispatches *through* the DOM. Since all Controllers are attached to a DOM node (the root DOM node of a React Component in this case) then they can catch
any events (including DOM events like `'click'`) that can be passed through the DOM. So in our `HelloWorldForm` we dispatch the event, it bubbles up through to be caught by our single instance of
the `HelloWorldController`.

Note in `addListener` that we provide an array of functions and numbers. In Ringa, when listening for an event we can chain asynchronous and synchronous code together. Each method in the chain has
its arguments injected by name from the context of the Controller or the detail of the dispatched event. Numbers are just a trick to sleep for some milliseconds (super useful for building onboarding wizards or transitions).

For a better example of this using an actual API call, take a look at the Chuck Norris example.

## Conclusion

In this example we have shown how to easily create Ringa Models and Controllers. We highly recommend poking around some of the other examples, and if you feel really adventurous, you can take a look at
[ringa-example-react](http://github.com/joshjung/ringa-example-react) for a more advanced discussion of the features of Ringa in the code comments.
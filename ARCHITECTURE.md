# Getting Started

Ringa is a developer-experience centered framework designed to scale.

For every architectural decision, we asked the following questions:

1. What is the problem?
2. What would be the most enjoyable code to write to solve it?
3. Is this going to scale and not impact the *computers performance*?
4. Is this going to scale and not impact the *next developers performance*?

Following these questions we went back to the drawing board and put on our computer scientist caps.

*Note: The following requires a basic understanding of Javascript, Object-oriented programming, and a very basic understanding of nodes, trees, graphs, and algorithms.*

# Problem: Program Communication

Over the lifecycle of any new framework new patterns evolve in how components can communicate to each other. Like cells evolving into multicellular organisms and multicellular organisms evolving into animals so each framework tends to repeat history.

We decided to learn from the past and started with the basics of component communication.

## Approach 1: Components have lots of private conversations about everything

Applications need component communication. Due to the way CPUs work and the way that most languages are constructed, the most performant and simplest way to do this is via a method:

    // Inside component2
    component1.doSomething()

Unfortunately, this means that `component2` needs access to `component1`. In order to tell `component1` what to do, `component2` has to know about `component1`. As the program grows, the program becomes brittle. Changing one thing requires changing a ton of code. Bugs pop up everywhere. What if someone changes how `component1` works? What if we need to reorganize the view? Refactoring becomes a nightmare when the structure of the application or interfaces between the components change.

Clearly we need a better way.

## Approach 2: Components yell at everyone and hope the right guy gets the message

Let's invent some form of an event bus, like this:

    eventBus.register(component1)
    eventBus.register(component2)
    ...
    eventBus.register(componentN)
    ...
    eventBus.emit('someMessageForGodKnowsWho')

Every component registered with the event bus gets every message. And each component can decide what it wants to do with that message.

Once again, the downside is performance at scale. For example, a DOM might have upwards of thousands of elements. If each emitted event (like `'mousemove'`) has to be handled by every other DOM node in the DOM tree, then this means we have to do at least 10,000 operations for every event. This is slow.

## Approach 3: Components subscribe to get the notifications they want

    eventBus.on('someMessage', component1.handleSomeMessage)
    eventBus.on('someMessage', component2.handleSomeMessage)
    eventBus.on('someOtherMessage', component3.handleSomeOtherMessage)
    ...
    eventBus.emit('someMessage')

This is a huge step up. Now `component3` does not have to worry about emitted messages it does not care about.

There is one big problem with this approach. What if component2 needs to get the message first? `component1` has priority because it added a listener first!

## Approach 3: Components subscribe to get the notifications they want with priority

    eventBus.on('someMessage', component1.handleSomeMessage, 0)
    eventBus.on('someMessage', component2.handleSomeMessage, 1)
    ...
    eventBus.emit('someMessage')

Now in this case, `component2` has a priority of 1 for `'someMessage'` and the `eventBus` can intelligently hand the message to that component first even though `component`` asked for the message first.

But what if `component2` handles the message and decides the message needs to be cancelled so nobody else can hear it?

## Approach 4: Components subscribe with priority and ability to cancel

    eventBus.on('someMessage', component1.handleSomeMessage, 0)
    eventBus.on('someMessage', component2.handleSomeMessage, 1)
    ...
    component2.handleSomeMessage('someMessage', (event) => {
      event.cancel();
    });
    ...
    eventBus.emit(new Event('someMessage'))

Excellent, now `component1` does not get the message.

Unfortunately, now we have a bigger problem. What if some rogue developer decides they just want to get all priority for all messages? They could just pass in a super high priority for everything and screw everyone over. What if someone gives themselves a super high priority and then cancels the event? Another developer might sit there scratching their head wondering why in the world their event listener is not working. This brings up our next problem: how is `component2` supposed to know what `component1`'s priority is so that it can set the priority properly?

Clearly, event priorities started with a good intention but do not work well at scale, so they do not answer Question 3 or Question 4.

## Approach 5: Components communicate in a tree structure

Computer science tells us that all structures with at least 3 items can take the form of a tree or a graph. Graphs are inherently unruly when it comes to management. After all, if everyone can talk to everyone else and nobody has priority, who is in charge?

Most programming structures that involve communication tend to organize into a tree. Your file system, operating system processes, and almost all GUI display structures are based on trees. In a tree, parents have one or more children, and every child only has *only one* parent. The parent always has complete control over the child and must have priority in handling all events. If you delete a directory, all its children are deleted, for example. If you changes permissions on a directory you naturally change the permissions on all of its descendants.

One reason this tree structure works so well for communication is that all communication can be accomplished in an ordered manner if we say that each node can *only* communicate to:

1. Its parent
2. All its children

If a child needs to communicate to another child, it should do so through its parent. This allows everything to talk to everything else, but with a natural order of prioritization.

Heck, even our `eventBus` examples above are a tree structure with one root node (the `eventBus`) and N leaf nodes (the `component`s) with a depth of 1. The guideline was that all leaves in the tree can only communicate to each other if they communicate through the root node. So `component1` can only communicate to `component2` through the `eventBus`.

Combining everything we have learned so far, we can communicate with our parent and all our children like so:

    class Component {
      constructor(parent) {
        this.children = [];
        this.parent = parent;
      }
      addChild(child) {
        this.children.push(child);
      }
      emit(event) {...}
    }
    ...
    component.parent.emit(message);
    component.children.forEach(child => child.emit(message);

What if something really important happens in a child and it needs to tell *all* of its ancestors (parent, parent's parent, etc.) about the event?

We can do this:

    let parent = component.parent;
    while (parent !== undefined) { // root node doesn't have a parent!
      parent.emit('someMessage');
      parent = parent.parent;
    }

This is nice, but it is also requires 5 lines of code. It's not very practical. Coming back to Question 2, this is not very fun to write *every* time. Also more code means more bugs, so it is also not very scalable.

So what if we do this instead:

    class Component {
      emit(event) {...}
      emitToAncestors(event) {
        let parent = this.parent;
        while (parent !== undefined) { // root node doesn't have a parent
          parent.emit('someMessage');
          parent = parent.parent;
        }
      }
      emitToChildren(event) {
        this.children.forEach(child => child.emit('someMessage');
      }
    }

Now we are getting somewhere. Here we can make this better by employing a principle:

*When a method name is duplicated with a different qualifier, refactor the qualifier into a parameter*

So let's change it up:

    class Component {
      // emitToAncestors(event) {...} DELETE
      // emitToChildren(event) {...} DELETE
      emit(event, toAncestors, toChildren) {...}
    }

Much Better!

Unfortunately, this means that each instance of `Component` is now responsible for stepping through each ancestor and emitting the event on each one. What if an ancestor wants to stop the message from going further? With a little bit of refactoring we move `bubblesToAncestors` and `propagatesToDescendents` into the `Event`:

    class Event {
      constructor(type, details, bubblesToAncestors, propagatesToDescendants) {...}
      cancel() {
        this.cancelled = true;
      }
    }
    ...
    class Component {
      addListener(eventType, handler) {
        this.listeners[eventType].push(handler);
      }
      emit(event) {
        if (event.cancelled) {
          return;
        }

        // 1st Priority: Parent
        if (event.bubblesToAncestors && this.parent) {
          this.parent.emit(event);
        }
        
        // 2nd Priority: Ourself
        if (this.listeners[event.type] && this.children) {
          this.listeners[event.type].forEach(listener => listener(event));
        }
        
        // 3rd Priority: Children
        if (event.propagatesToDescendants) {
          this.children.forEach(child => child.emit(event);
        }
      }
    }
    ...
    // Send a message to everything in the entire tree!
    component1.emit(new Event('someMessage', {}, true, true);

*Note: some of you might notice that this is a combination of a parent walk and a breadth-first search algorithm.*

Now each item that receives the event can check to see if `event.bubblesToAncestors` or `event.propagatesToDescendants` is set and then emit it appropriately only if the event has not been cancelled.

But now we have a scaling issue again. Unfortunately `propagatesToDescendants` is going to be ridiculously slow if it is dispatched from the root node and there are 10,000 descendants. When a program is small and only has 100 descendants, it might be tempting to dispatch lots of events from the root node but once the program scales this is going to get exponentially slower.

To be on the safe side, we remove `propagatesToDescendants` to protect developers from ourselves.

Now we still need a way for parents to communicate to descendants. We know that children can easily look through their ancestors and listen for events.

What if we invert control and let child components listen to the root directly, similar to employees in an organization subscribing to their boss' blog:

    class Event {
      constructor(type, detail, bubbles);
    }
    ...
    class Component {
      emit(event) {...}
      on(eventType, handler) {...}
      get parent() {
        return parent;
      }
      get root() {
        return this.parent ? this.parent.root : this;
      }
    }
    ...
    class MyComponent {
      constructor() {
        // SUBSCRIBE TO ROOT MESSAGE
        this.root.on('someImportantMessage', () => {
          console.log('Yeah, so, the president just sent me an email...');
        });
      }
    }

Excellent, now if the root node  has to say something super important, every single component has the ability to listen directly to root without root having to emit to every descendant in the application.

## Final Approach

Now we can take all of the principles we have discovered and build out a basic event system that works well with the natural tree structure of a browser client.

Let's start by organizing our naming to match the way this is implemented in the DOM according to the W3C and specifications:

* `on()` becomes `addEventListener()`
* `emit()` becomes `dispatchEvent()`
* `get root()` becomes `document` or `window`
* `cancel()` is called `stopPropagation()`
* `Component` is `EventTarget`
* `parent` is `parentNode`

    class Event {
      constructor(type, detail, bubbles);
      stopPropagation() {...}; // cancel
    }
    ...
    class EventTarget {
      dispatchEvent(event) {...}
      addEventListener(eventType, handler) {...}
      get children()
      get parentNode()
    }

Now any listener for the event in the ancestor tree can cancel the event any time it wants!

At this point I am going to stop and let you explore the entire event lifecycle. Things I have not covered include:

* `stopPropagation()` vs. `stopImmediatePropagation()`
* 'capture' vs. 'bubble' phases of an events life

Needless to say the DOM event system across all browsers is powerful and is used for every `'click'`, `'keydown'`, `'mousemove'`, etc. event handled by the browser. By using `CustomEvent` anyone can do all communication in your program while ensuring high performance, a natural tree-structured prioritization, and separation of concerns.

# Conclusion

Numerous problems of program communication are solved elegantly in the tree structure provided by the DOM.

In Part 2, we will discuss why Ringa has chosen to adopt using this event dispatching system for all of its communication.

Part 2
------

# The Model, the View, and the Controller (MVC)

As your client application, the company, and your team grows code complexity increases exponentially. Refactoring tools can help resolve some of the problems, but only for so long until the software patterns used at the beginning of development begin to reveal their limits.

Tiny changes in the API, like adding a field for a user profile picture, suddenly have trickle-down effects throughout the entire codebase. Before you know it, you are rewriting your entire application or spending hours on what used to be small bugs.

"Little updates" to the view like swapping a list for a grid now require restructuring your entire view. And if the old view components were making database calls and managing the logic of validating the data, this might affect thousands of lines of code. Before you know it, your developers are complaining that the application code "sticks", is "unmanageable", and needs to be completely rewritten. Managers stand back in shock wondering why in the world the same developer who was raving about how awesome the codebase was 2 months ago is now saying it is complete garbage.

The main reasons the codebase ends up like this is because at some point one of these will occur:

1. Your *M*odel changes (e.g. the API is expanded)
2. Your *V*iew changes (e.g. the UX or comps change)
3. Your *C*ontrol changes (e.g. refactoring of logic is required or business direction of company changes)

Each time this happens, the codebase becomes more complicated and more tightly intertwined like a box of christmas lights that gets a new strand added every development iteration.

Over time the MVC pattern was born to indicate separating the concerns of the Model, View, and Control of your application.

*Note: Sometimes the API is treated as a separate fourth component but it is normally categorized as part of the Control.*

# MVC Communication

How should the Model, View, and Controller communicate with each other? What are their responsibilities?

## Basic Approach

In its simplest scenario we could do this:

    class Model {...}
    class Controller {...}
    class View {...}
    
    window.model = new Model();
    window.controller = new Controller();
    window.view = new View();

As a team lead, we then just tell everyone that no control code goes in the view or model, etc.

Unfortunately before long developers are going to have differences of opinions on what is view logic and what is business logic. Is validating a form business logic or should that exist in the view? They will debate whether a property like `showPopup` should exist on the model or the view. And they will start to code references to the view into the Controller because it is faster or the particular situation seemed to call for it (e.g. opening a modal after a database call).

Despite our best efforts the codebase quickly becomes tightly coupled again and doing something that we thought should have been simple (like restyling popups) requires touching everything in the codebase.

## Assigning Basic Responsibilities

Let's break our problem into pieces.

The purpose of a client application is to satisfy humans. Therefore, all client application problems fall into one of two categories:

1. Application gives information to the human
2. Human gives instructions to the application 

The purpose of a client developer is to do the two things above without shooting their future selves in the foot by writing code that does not scale well. To do so, we not only divide our application into sections but we designate responsibilities to each part:

### View(s)

*On human interaction*: when it might affect the model, tell the controller what happened

### Model(s)

Just exist and take life's changes, like the dude.

### Controller(s)

*On view instruction*: make necessary API calls, perform business logic, and update the model.

### Unassigned Responsibilities

*Startup*: populate the model (defaults or from API)
*Startup*: give the view access to the controller/model
*Refresh View*: on a model change, refresh the minimum portion of the view necessary

These are the basic responsibilities *most* MVC frameworks start with. Details vary between frameworks and languages, particularly on the unassigned responsibilities. The details have lead to a large number of iterations on the MVC pattern which in many cases are called something different. For example the MVP (Model-View-Presenter) pattern. For the sake of simplicity, some have started to refer to any type of MVC pattern as an MV* pattern, since the area of control is often the most hotly debated.

## Startup: Populate Model

TODO

## Startup: Injection into the View

TODO

## Refreshing the View

*Model tells the view when it changes.* In this approach the view tells the model what properties are important for its proper display. The model dispatches an event to the view whenever one of those properties changes.
*Controller tells the view when to refresh.* This one is fairly straightforward, but has the limitation that when we want to only refresh a part of the view the controller needs to know which part. And if the controller has to know about something on the view, then we have not really separated the view and the control.

Given that we only have 3 components in our MVC, these are - naturally - the only mathematically possible options.

There are some options that seem . For example, when the view tells the controller to do something it provides a callback when the controller is done so that it knows when to refresh itself. The downside to this is that only the portion of the application that told the controller to do something gets an update when the model changes. Sometimes changing something (like a users name) means that lots of sections of the view need to be refreshed.

Asynchronous Management
-----------------------

As a general rule, whenever the controller is told to do something we should always assume it is asynchronous. The reason is that if an action changes from synchronous to asynchonous we do not want to have to update any of the other code in the controller or the application.

This is the underlying rule behind the development of Javascript Promises: provide a core pattern and library for developers to follow to add asynchronous code to their application.

Ringa was originally developed before promises and it provided a unique solution. That said, it does have built-in support for promises so that your team can get the best of both worlds.

# Decouple the View from Asynchronicity

Consider the following code:

    // In View Component when user types in a username
    usernameChangeHandler(event) {
      this.user = Controller.getUserByUsername(event.username);
      this.refresh();
    }

Our problem now is that this assumes that all of the users have been loaded into our model so that the controller can immediately filter to the one that matches the username. Obviously this is impractical and a security concern, so the controller is probably going to have to make an API call. If the controller needs to make an API call, the data will not be available immediately after calling `getUserByUsername()`. As a result, our simplest solution is just to add a callback for when the controller is done finding the user.

Using promises is a solution to this:

    // In View Component when user types in a username
    usernameChangeHandler(event) {
      let promise = Controller.getUserByUsername(event.username);
      
      promise.then(result => {
        this.user = result.data;
        this.refresh();
      });
    }

This is better! Now the controller can return immediately if the user has already been loaded and cached or it can return later once the API call has completed. The view is no longer concerned with that responsibility and the controller can be greatly changed without needing an update to the view.

But now we have another problem. What if other components in the application also need to be notified when this user object has been updated? One part of the view should not have the responsibility of telling the rest of the view that the selected user has changed! By coupling our `user` model to the view, we have greatly limited ourselves. Instead, we should give the controller the responsibility of updating the model and notifying the view that something has changed.

Here is an example of the view component when it waits for updates on the model:

    // In View Component when user types in a username
    usernameChangeHandler(event) {
      Controller.getUserByUsername(event.username);
    }
    // Called when the model is changed for any reason
    userChangeHandler(user) {
      this.user = user;
      this.refresh();
    }
    
In this scenario, the view component tells the controller about a human interaction (typing a username) and then waits for the model to change. All responsibility of control of the application has been passed to the controller and the view is fulfilling its two responsibilities of listening for device input and displaying model changes to the user.

How `userChangeHandler()` is called is another topic that will be discussed later. In the meantime, if you interested in studying further, look into dependency injection and inversion of control for ideas.

# The Problem with Callbacks and Promises

Over time asynchronous sequences become a little... ridiculous to manage. Because every single asynchronous call requires adding a callback - and an error handler! - before you know it you end up with spaghetti code if you are not extremely careful.

Let's say we need to do the following:

- GET the current user
  - GET the current user's profile picture
    - GET the current user's friends
      - GET the current user's friends profile pictures

*Note: this could definitely be optimized on the server!*

Using Callbacks:

    getUserByUsername(username, callback) {
      API.getUserByUsername(username => {
        API.getProfilePicture(user.id, url => {
          user.profilePic = url;
          
          API.getFriendsForUser(user.id, friends => {
            user.friends = friends;
  
            let count = friends.length;
            
            friends.forEach(friend => {
              API.getProfilePicture(friend.id, url => {
                friend.profilePic = url;
                count--;
                if (count === 0) callback(user);
              });
            });
          });
        });
      });
    }

This has been named the Pyramid of Doom and is one of many reasons promises were invented.

So, using native Promises:

    getUserByUsername(username) {
      return API.getUserByUsername(username).then(user => {
        model.user = user;
        
        return user;
      })
      .then(getProfilePicture)
      .then(url => {
         model.user.profilePic = url;
         
         return user;
       })
      .then(getFriendsForUser)
      .then(friends => {
        model.user.friends = friends;

        let promise = new Promise((resolve, reject) => {
          let count = friends.length;
          friends.forEach(friend => {
            API.getProfilePicture(friend).then(url => {
              friend.profilePic = url;
              
              if (!--count) resolve(friends);
            });
          }));
        });

        return promise;
      });
    }

*Note: this promise code could be highly optimized using a library like Bluebird or Q for Angular.*

The first major advantage of promises is the ability to add a `catch()` call at any point and intercept problems. Promises essentially unifed what everyone was doing with callbacks.

One huge advantage of promises is that they can be passed around your application and other objects can listen to them. For example, you could setup your API like this:

    GET(url) {
      let promise = new Promise((resolve, reject) => {
        // Make a HTTP GET request for url and call resolve() when done.
      });
          
      promise.then(result => {
        console.log('API CALL RESOLVED', result);
      });
      
      promise.catch(error => {
        console.error('API CALL ERROR', error);
      });

      return promise;
    }

This is super powerful because now have created a central point that intercepts the results and errors of every single GET request in our application if they use this method. But this has a huge downside: because promises are so flexible and can be passed around anywhere, there is no central location in your application to see how an entire promise chain is built. Debugging what promises are attached to what other promises and who is waiting on who or what can be a nightmare especially as codebases grow.

# Ringa Command Sequences

Ringa takes a different approach from promises by treating the control of your application as a tree of commands. It asks the questions "What would I love my code to look like?"

If your actions for `getUserByUsername` looks like this:

- GET the current user
  - GET the current user's profile picture
  - GET the current user's friends
    - GET the current user's friends profile pictures

Ringa code looks like this:

    // In Controller
    this.addListener('getUserByUsername', [
        GetUser, [
          GetUserProfilePicture, [
            GetUserFriends,
            GetUserFriendsProfilePictures
          ]
        ]
      ]);

    // In View
    Ringa.dispatch('getuserByUsername', { username });

A Ringa command tree is just a tree of processes to be run, with special rules on what to do when one has completed. Because this tree is defined in your controller before it is triggered, you can easiliy see the entire structure of what *should* happen without having to inspect a lot of code. In addition because the business logic of each command is separated from the controller itself, you do not have to wade through the business logic to view the overall structure.

Ringa sees the control of the application like this:

* *Controller*: sky view of every possible thing your controller can respond to and the tree of commands it produces.
* *Command*: ground view of the responsibility of this particular command.

In addition, you do not just have to use commands in a Ringa tree. You can also use:

* Promises
* Events
* Functions
* Timeouts
* Custom executors

The possibilities are endless in how you respond to a command and you can mix and match complex asynchronous and synchronous processes together as a response to events.

# Events

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

Here is the example code with renaming:

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

At this point you can take some time to explore the entire event lifecycle of the DOM. Things I have not covered include:

* `stopPropagation()` vs. `stopImmediatePropagation()`
* 'capture' vs. 'bubble' phases of an events life

Needless to say the DOM event system across all browsers is powerful and is used for every `'click'`, `'keydown'`, `'mousemove'`, etc. event handled by the browser. By using `CustomEvent` anyone can do all communication in your program while ensuring high performance, a natural tree-structured prioritization, and separation of concerns.

# Let's Use It!

Ringa uses the built-in browser event system instead of its own event bus. The reasons for this are numerous, but here are a few that are super useful:

* Reuse of concepts developers are already forced to learn
* Ringa controllers can be easily given an area of responsibility depending on where on the view they are attached
* Ringa controllers can respond to view events (like listening for all clicks in the capture phase to run metrics on user interaction)
* Ringa controllers can communicate with each other easily through the DOM and bubbling or capture events
* By forcing Ringa controllers to be attached to the DOM we avoid the pitfalls of singletons
* By avoiding singletons we can easily create libraries that have both view and controllers and they can easily integrate with other versions of Ringa or even an application that does not use Ringa at all

# Conclusion

Numerous problems of program communication are solved elegantly in the tree structure provided by the DOM.

In Part 2, we will discuss why Ringa has chosen to adopt using this event dispatching system for all of its communication.






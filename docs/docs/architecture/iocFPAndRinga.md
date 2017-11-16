# Functional Programming, Inversion of Control, and Ringa

*Note: the following article is about the architectural concepts of GUI and is not related to Javascript at all. This
could apply to any language that involves a tree of UI components.*

## Topic Introduction

The last several years have seen a wave of programmers pushing harder for functional programming and using a global state
store to manage their applications. I designed the concepts of Ringa back before any of the modern Javascript frameworks
and libraries were around (back in 2010) and, quite honestly, before I really understood the details of functional
programming.

As a result, rather than try to compare Ringa's architecture directly to the pros and cons of functional programming and
a global state store, I will just provide a walkthrough of my own understanding of functional programming and inversion
of control in an attempt to explain how I used Ringa to tackle the same problems.

## Side-effects and State

### Defining the Problem

There are two contexts web developers are generally referring to when discussing side-effects:

* Functions
* Visual (GUI) Components

In programming languages, a function has a side effect when running it can mutate a variable outside of its scope. This
can make running a function "unsafe". If I am calling the function `foo()` everywhere in my code and the developer of the
function decides that he is going to wipe all the DOM nodes whenever `foo()` is called, my code now no longer works. The
same goes for if I pass a mutable argument by reference into `foo()` and `foo()` decides to change all the properties
on the argument without my knowledge. Either way, `foo()` is unpredictable and volatile, and like Donald Trump or Brexit,
must be stopped.

Likewise, in GUI frameworks, a visual component could also reference or change other components or models that it should
not have access to. Or if a GUI component holds internal state properties that change between each call to render, then
each time I render it, it could look differently even though I am telling it to render itself the same each time. 

As a program size increases, it can become impossible for a developer to know what a specific function or visual component
is going to do when it is called or rendered. So in both scenarios - functions or GUI components - there are massive
benefits to creating a pure implementation where calling the function - or rendering the visual component - is guaranteed
to be predictable and have no side effects.

The problem, in short, is that we **want to eliminate side effects**:

* One solution for programming languages is to have a pure functional language like Haskell or Erlang.
* The analogous solution for rendering a GUI is to mimic a functional language by developing pure components that
have a single render method with properties passed from the parent and no internal state.

Within React, for example, Pure components only contain a `render()` function that is guaranteed to only look at
`this.props` and predictably returns the exact same DOM representation for any given props - every time.

### Functional Advantages

There are massive advantages to the pure functional approach. For example, when using functional programming you can
memoize results of the calls. This allows you to cache (at the expense of memory) all previous calls and speed up future
renders of every component instance. If you can memoize what a component looks like with the same props, and render it
1000 times on the display with the same props, you really only run the render function once.

Another advantage to functional is in multi-threaded or multi-core implementations. Normally, with threading we end up
with lots of potential for deadlock especially if multiple threads have write access to locations in memory. There are
tons of unique ways to solve this problem, but they generally involve forcing one core or thread to sit and wait for
another to relinquish access to a resource (e.g. some form of mutex). In functional programming every passed argument
is unique or immutable and the function is memoizable so we can split our work across processes much more easily with
virtually no deadlock since we can predict beforehand that no two functions will be fighting over write access to a
location in memory.

There are many more advantages but I will leave this as a research exercise to you. Suffice to say, I am in no way trying
to argue for or against functional programming as it can be incredibly effective, and has been in many scenarios, since
its inception in the 30s via lambda calculus.

But one thing I think we need to be certain about: functional programming is a tool designed to help reduce human error
and there are plenty of tools in programming designed to do this outside of the functional programming camp. The real
world is full of side effects and no matter how hard we try we cannot make our entire environment for development
completely pure. Even our web browser is full of side effects, as you cannot predict what your end user is going to
do. Heck, every end user now has access to a Javascript console and the DOM through browser developer tools so at the
end of the day nothing is 100% safe from side effects.

But we can try...

### Pure Functional Components

Is it possible and practical to solve the side-effect problem across an entire GUI application using functional programming
principles?

For our entire GUI to be pure functional, **each component in our view must**:

* Get its properties passed from its parent
* Not access values outside of what is passed
* Not store any local state between renders 

On the surface, this seems fairly reasonable, but personally I see two large problems with this approach:

1. Like an idealistic political narrative, every component and developer has to be fully committed to the approach
2. Every tiny update forces potentially a ton of work that might not be necessary

At least in 2017, getting (1) to happen is a tall order especially if a developer wants to use a component available via
something like the open-source community. Your components may be purely functional, but the ones you might depend on
may not be.

Regarding (2), this might require a little more explanation.

Functional programming got its concepts from lambda calculus where ideally the entire world works like a mandelbrot. One
passes in a few root arguments to a recursive set of functions that predict every leaf node render ad infinitum. In
functional programming, your ideal scenario is passing the least amount of data necessary to the root call and then
calculate as much of the remaining data as possible through subsequent function calls. Sadly, most GUI applications do
not work like this.

One good example of doing something like this might be passing a giant flat string of user information into your render
and subsequent functions split out the information (first name, last name, email, address). However, with web browsers
we run into the problem that they do not fit very well into a functional paradigm because so much of the work we have
to do is asynchronous and in functional each callback requires running through the entire render stack... again.
Additionally, another reason functional is a hard fit with GUI is that in most GUIs (like a webpage) our most critical
information is often needed by the leaf nodes and its ancestors cannot calculate that data from a subset. Normally we
already know what the users first name is from the root of the GUI... we are just trying to update *one* leaf deep in
the tree.

As a result, what happens is that we simply invert our entire problem set into a new domain. Our components have become
"lightweight" because they retain no state and are "dumb" in that they just do what they are told and do not try to
make any predictions but now all of the sensitive data for our leaf nodes in our GUI has been simply extracted into one
giant state store tree that holds everything.

And that state store, by definition, has to be mutable at *some* point... so we have eliminated side effects in our
render calls but we have not eliminated them completely.

### Pure Functional Problems

What this means practically in the most pure functional component implementation (without many optimizations)
is that to make the tiniest change to a leaf node in our GUI we have to **rerender (or at least recompare the output of)
every GUI component node** and since every single component in our GUI has access to data it only needs so that it can
pass it to its children we have to **make the entire state store immutable before beginning our render so that a node
does not accidentally change a store value**.

So, if I want to just *update a single label on the DOM*, I have to:

* Call an action handler with a payload for the change (reducer)
* Make a clone of my entire state (might not be too expensive if we are copying by reference)
* Change the one value
* Lock my state by making every value immutable
* Recall a comparison function on every single component in my GUI tree to find the one DOM node that needs changing
* Compare the shadow dom to the real DOM
* Update the single label or div that needs refreshing

The "rerender everything" problem is fine for video games, where every pixel on the screen has to be rerendered every
frame anyway, but for a GUI display where you simply want to update one text element, in my opinion this is an
unnecessary amount of work, especially in an era where power conservation is being emphasized.

In addition, the entire point of this new approach was eliminating side effects. While it does eliminate side effects in
that we might be partially guaranteed our 1000 GUI components on the screen are not retaining anything from a previous
render, as mentioned above our single giant state tree has to be configurable and mutable at some point before we begin
our render, which opens us up - again - to side effects in our reducers, for example.

Using something like Redux, as our application scales we end up with a ton of reducers. If some rogue developer decides
to mutate something on the state in a reducer that he should not we cannot stop him. In addition, if someone adds a
property to a child deep in our GUI tree that changes with every update to the state, then every component is going to
rerender even if we do a property comparison. If I have 50 reducers and suddenly one of my leaf nodes in my display is
rendering something wrong, I might be able to predict which part of the store is providing the value, but I still have
to dig through all the reducers potentially to figure out which one was causing the problem. Is this actually easier
than tracking down a bug in the same component because it was storing local state? It may be, but we still have not
completley squashed the problems caused by human error.

But the problem is even more complicated. Even though I have made my state immutable, I still cannot stop a developer
from passing individual properties at a component level that might be using external state to its children so making
our entire store immutable still does not make our render predictable if a developer decides to break the functional
programming "rules".

And what if a component deep in our hierarchy does not have access to a part of the store it needs? We still have to dig
through all of its parents to figure out which one we did not pass `{...props}` to or perhaps a component that decided it
was only going to pass a subset of the properties to its child.

To top it off, now I have a ton of extra boilerplate, especially if I want to use the container paradigm to help improve
performance and make my property passing more predictable. I end up creating a bunch of "wrapper" components that do
virtually nothing except pass the right props from my state store to a subset of my GUI components.

The functional programming paradigm's goal was to reduce side effects by removing state from components but now we have
just shifted our entire set of problems into a new domain and now created a bunch of solutions and programming "rules"
in that new domain to avoid a whole new set of bugs.

As always, developer diligence and some best practice principles are required whether you choose functional or
imperative style of programming. Neither functional nor imperative programming is better, they are just different and
an inexperienced or poor developer is guaranteed to naturally create bugs in both.

## Inversion of Control (IOC)

**Note: it is highly recommended that you read up a little on the concepts of inversion of control (IOC) before reading
this section. A good overview, with analogies to functional programming, can be found n the article
[How to Trick OO Programmers into Loving Functional Programming](https://medium.com/easy-pieces-for-programmers/how-to-trick-oo-programmers-into-loving-functional-programming-7019e1bf9bba)**

In traditional inversion of control, components use declarative measures to say what dependencies they need and generally
a single global builder is responsible for providing those dependencies to each component.

The advantage to this approach is that, unlike the functional paradigm above, each parent in your tree is not responsible
for providing properties to its children. As a result, you will rarely find inversion of control discussed in a purely
functional programming context.

Inversion of control is used heavily in backend systems like traditional Java enterprise systems. There are tons of
advantages to this approach and I will leave that up to you to research.

For GUI systems, inversion of control can work quite well. Typically it is set up by having a single builder object
that is configured at application startup in the root of your GUI tree or as a singleton. As use of the application
progresses, new components are created and they are in some way given access to the builder or the builder is notified
of their creation. For example, in Adobe Flash back in the day you could listen in the root GUI component using the capture
phase of events for a signal when any new component was added to the component tree and then the builder could inspect the
metadata of the component and inject its dependencies. In more complex implementations, if you instruct the builder
that a thing has changed (e.g. the User object), then the builder has kept track of every single component in the GUI
that "needs" the User object and will provide the new user object to them so they can update themselves.

Regardless of the exact implementation details, in IOC the builder "wires together" the entire application automatically
and can notify sets of components when their dependencies have changed.

Essentially IOC is another declarative approach outside of functional programming to accomplishing the same goal of
providing properties to children but in a safe environment that eliminates side effects. After all, a builder could
choose to provide immutable objects to the components requesting them.

Four advantages I see of IOC over pure functional in GUI programming are:

1. You eliminate the need for a single giant state store
2. You do not have to iterate over every component in the GUI to check to see if the changed state might have
caused a mutation in the render
3. You are not forced to duplicate the entire application state for a tiny change
4. You do not have to create non-functioning container wrappers to subdivide your components and inject only the subset
of the store you need

Another advantage of traditional IOC in OO programming is that a component can request a *type* of thing. If you build
a modal window called `NewUserModal` that displays inputs for first name, last name, and email you could simply declare
that the `NewUserModal` has a dependency on the `UserModel`. If you extend `UserModel` with the `SuperUserModel` and
then add an instance of `SuperUserModel` to your builder then the builder will inject that into your `NewUserModal` and
the user modal will not care that it is a subclass. It will just use the properties it needs from the `UserModel` base
class and ignore any super features added. This is one great way of future-proofing code and creating new type extensions
without breaking old GUI components.

That said, in GUI systems the traditional IOC with a *single* builder has huge downsides as well.

The biggest downside is when an application starts to use libraries or third-party components. Or if you need to have a
subset of your application function differently than the rest.

Take for example a simple scenario where I want to use IOC and I want to display two Data Grids on the screen at one time.
Let's also says that these data grids are from an external library and declare they both need a `DataGridModel`. How will
my IOC builder know *which* data grid model to inject into each one? Well this will depend on which part of the GUI tree
each grid exists within. Perhaps one grid is in the `UserListContainer` section and the other is in the
`TransactionsListContainer` section of your application.

Obviously a single root builder is fairly naive to what is going on. All it sees is two requests for a `DataGridModel`
come in and it does not know which grid is in which section of the application.

If only there was an IOC solution that worked with the DOM tree in an intelligent way to resolve these scenarios...

### IOC + Tree Structure + No Side Effects = Ringa

What if there was a single Javascript library that:

* Eliminated side-effects by removing as much state as possible from components 
* Provided IOC and worked well with the GUI tree and resolved injections by context within that tree
* Avoided all god objects or singletons
* Let every component declare exactly what its dependencies were by type *or* by name
* Was able to inform only the components that need to be updated that a change has occurred in their dependencies
* Eliminated almost all boilerplate code
* Provided a set of debugging tools that helped you find how all your injections are wired together

There is and welcome to Ringa.

## Ringa: Inversion of Control Tree

Ringa is more than a typical inversion of control system. It uses the natural DOM tree to layer your dependency injections.

Each component in your GUI tree declares its dependencies. Then during runtime, each component steps through its parents
one by one looking for the *closest* dependency it can find that meets its needs. In this way I even hesitate to call it
dependency *injection*. It is a form of version control but where an algorithm is used starting at the dependent node to
find what it needs. In this way, by default every node in the tree will look all the way to the root node for its
dependencies and the root node functions as a traditional builder in an IOC system.

Another way to think about this might be to compare it to the stack in programming. Imagine for a moment if you could
write functional code like this:

    let b = () => {
      let x = findFirstInStack('x');
      
      console.log(x); // Should output 1 but ONLY when called from a()!
    }
    
    let a = () => {
      this.x = 1;

      b();
    }
    
    a();

In this scenario, the b() function could exist at any depth in the stack and rather than passing properties through as
arguments, it would search up through the stack to find the first location where x is saved and then use that instead.

This is what Ringa does in your GUI.

However, as your program grows, you can customize individual subtrees in your application by providing new models at key nodes
in your tree. For example, you could decide that rather than having a single `DataGridModel` provided at the root of
your application, you now need to provide two of them. You provide one `DataGridModel` through the `UserListContainer`
node and another through the `TransactionsListContainer` node. By the nature of the natural container structure of your
application you can be very confident that no leaves outside of the subtree of the `UserListContainer` are going to need
this model. However you cannot be sure *where* in the subtree the `DataGrid` may end up due to UX requirements that might
change. So by providing the model at the deepest safe point for the UX that you can, you both ensure that you can split
that entire portion of your subtree into a module later if you like and also keep yourself open to large UX refactoring
in the future. Now, the `DataGrid` visual component instances, regardless of where they are positioned in the entire subtree
relative to those two ancestors will automatically find the grid they need. You can move them around anywhere in the subtree
and they will still just work.

This helps you build components and libraries too, because now you can "break off" entire subtrees of your display tree 
easily. Since your IOC providers are attached to the root nodes closest to the most modular part of that section of your
DOM tree, you can break them out into new libraries easily starting at that root node. This is something that would be
much harder in a functional programming or traditional IOC context.

Each `Controller` in Ringa can be attached anywhere on your DOM tree and by default provides all of its child models,
by Class type(s), by id, or by name to any of that nodes descendants.

## Ringa: Tree Communication

In addition, Ringa goes far beyond dependency injection because it uses the DOM tree for all communication. Just like
traditional IOC with a single builder, traditionally a lot of communication frameworks (like Cairngorm in Adobe Flex or
Redux in Javascript) use a single master bus for communication because this was easiest to understand.

Just as each component looks through its ancestors one by one to find its dependencies, so in Ringa each component
communicates by using bubbling events on the DOM. This means each component at any point in the DOM tree can both intercept
and perform its own dependency injections and *also* intercept all events (e.g. by listening to the capture or bubble
phase of an event meant for a descendant or an ancestor).

This one-two punch of Ringa of treating dependency injection and intercomponent communication using the same heirarchy
prepares your entire application to be as modular and extensible as possible.

## Conclusion

All of the above paradigms have their place, but I hope this article sheds a little light on the inner workings of the 
architecture of Ringa and why decisions were made as they were.

I still feel that pure functional programming and traditional IOC have their place. However, after working with the
concepts of Ringa for about six years now, I personally feel it is a really solid concept that has a lot of opportunity
to grow and I hope it can help your project be more successful.

To summarize with an analogy:

* Functional programming is hierarchical management where direct bosses are responsible for giving their employees
exactly what they need and keeping them from messing with anything other than what they are given.
* Traditional IOC is a dictatorship where a single boss is responsible for giving out what each employee needs.
* Ringa is flat priority style with a hierarchical management structure where employees are empowered to request whatever
they need to get their job done and are responsible for going through each boss incrementally to get what they need.
But each boss is also empowered to redirect their employees and shield them from upper management.

**Ringa is a singleton-less inversion of control system that uses the natural flow of the DOM tree to help create context
for both communication and dependency injection.**

## Events

All communication in Ringa occurs between `Controller` instances via `Bus` objects.

For busses, you have one of two options:

1) The DOM `CustomEvent` bubbling event system.
2) A recreation of the DOM bubbling event system via the Ringa `Bus` (for server-side or custom implementations).

Internally all events in Ringa are wrapped with the `RingaEvent` object, which has methods like `then` and `catch`
so that events can work like `Promises`.

**Note: The term `bus` is often used in the Ringa documentation. Both a DOM node and the Ringa `Bus` objects are valid "bus" objects and are treated identically within Ringa.** 

## 1. Dispatching

## `dispatch()`

    dispatch(eventType, detail, bus, bubbles = true, cancellable = true, requireCatch = true)

* `eventType`: a String event type
* `detail`: the detail Object
* `bus`: a Ringa `Bus` object or a DOM node (e.g. like `document` or a `div`)
* `bubbles`: whether to allow the event to bubble to ancestor busses (DOM nodes in browser)
* `cancellable`: whether to allow the event to be cancelled (not yet implemented)
* `requireCatch`: show a warning in the console if the event is not caught by a Ringa `Controller`


    import {dispatch} from 'ringa';
    
    let ringaEvent = dispatch('doSomething', {
      text: 'this is the event detail object, injectable via $detail'
    }, document);

In this example, we are using the browser `document` as the bus so any `Controller` objects listening for `"doSomething"`
will respond.

## 2. `then` and `catch`

`RingaEvent` objects act like promises. Goal is full implementation of the Promise API:

    import {dispatch} from 'ringa';
        
    let ringaEvent = dispatch('doSomething', {
      text: 'this is the event detail object, injectable via $detail'
    }, document);
        
    ringaEvent.then(() => {});
    ringaEvent.catch(() => {});
    
Note that `then` and `catch` fully implement the injection mechanism and you can inject any Ringa variables to the function
arguments:

    let ringaEvent = dispatch('doSomething', {
        text: 'Hej Ringa!'
      }, document).then(text => {
        console.log(text); // Hey Ringa!
      });

## 3. Debugging

If you set `debug` to `true` in a `RingaEvent` detail (and you are in `__DEV__` mode), you can get some additional console
output about the events lifecycle:

    let ringaEvent = dispatch('doSomething', {
        debug: true
      }, document)
`
    


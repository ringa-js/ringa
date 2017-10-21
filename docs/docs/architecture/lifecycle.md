# Lifecycle

The Ringa JS lifecycle has these five stages:

1. Event Dispatch
2. Controller Catch
3. Thread Execution
4. Model Update
5. View Refresh

Note that for each thread execution, multiple model updates or view refreshes may occur. In addition, model updates can trigger view refreshes without an initiating event dispatch.

# Event Dispatch

A `RingaEvent` is designed to be dispatched on a DOM Node or a Ringa `Bus`. When dispatched on a DOM node, the `RingaEvent` is wrapped with a Browser [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).

Like all Events, a `detail` object can be attached. The properties on the `RingaEvent` `detail` Object are available for injection by name into methods everywhere in the rest of the lifecycle, so choose names wisely.

# Controller Catch

Ringa `Controller`s may at first seem like glorified event handlers, but they are far more. The Ringa `Controller` is responsible for organizing the threads that a Ringa event can trigger. This means that two `RingaEvents` with the same type can be dispatched at the same time and the `Controller` will make sure to keep all the execution separate and make sure that the scope of all the injections is separated.

In addition, the `Controller` has default management for all your API errors, any Error throws, and any custom calls to either fail or cancel the event and all its associated threads. This allows for rollback of already completed executors and custom error handling.

Controllers also have global injections-by-name into every single executor they run. As a result, this is one of the best places to attach your models and configuration needed throughout your executors.

# Thread Execution

This is the meat and potatoes of Ringa. Every `Thread` in Ringa is a collection of sequential executors. Each executor can be:

* **`Command` Subclass**: if you want custom control over timeouts and reuse across threads
* **`ExecutorAbstract` Subclass**: advanced custom implementations
* **`function`**: for simple tasks
* **`Number`**: sleep for N milliseconds
* **`Array`**: execute a set of executors in parallel and wait for all of them to complete
* **`string` or `event(...)`**: dispatch a RingaEvent to trigger another thread and wait for it to complete
* **`stop`**: debugging capability to halt the thread temporarily for console inspection
* **`iif()`**: run one executor if a condition is truthy and another if a condition is falsey
* **`forEach()`**: run an executor for each item in an `Array` sequentially
* **`forEachParallel()`**: run an executor for each item in an `Array` in parallel and wait for all to be completed
* **`interval()`**: run an executor every N milliseconds until a condition is truthy
* **`assign()`**: merge details into the RingaEvent detail object
* **`spawn()`**: start an executor and do not wait for it to complete before continuing
* **`loop()`**: run the same executor over and over until a condition is met.

# Model Update (optional)

During any executor execution, you will probably need to update models. Ringa `Models` are designed so that individual properties or groups of properties, when updated, can send out a signal that they have changed. You can watch these properties and make updates to the view (or other code) based on the changes.

Each Ringa `Model` subclass has full control over when the view gets notified of changes. As a result, if you want to improve performance even more you can only notify the view when you want to that a change has occurred.

# View Update (optional)

Ringa extensions like [react-ringa](http://www.github.com/jung-digital/react-ringa) have built-in functionality to tie in seamlessly with your favorite framework and update the smallest subset of view components necessary when a property changes. In addition, changes are batched so that if you change a property numerous times or a set of properties the associated views only get notified once per stack frame. So you can rest easy knowing your view will be updated the fewest number of times necessary.

# Diagram Summary

This diagram summarizes a standard flow with a single `RingaEvent` and a single `Controller`:

![Diagram](http://i.imgur.com/BWhTZOk.jpg "Lifecycle Diagram")

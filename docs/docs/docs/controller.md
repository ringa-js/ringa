# Controller

* Extends [`RingaObject`](/ringaObject)

The Ringa JS `Controller` serves the following functions:

* A container for `Models`
* Listens to DOM nodes or `Bus` objects for events
* Creates and coordinates asynchronous threads in response to events

The Ringa JS `Controller` is capable of handling any asynchronous operation in your application in a modularized and highly readable fashion.

## 1. Construction

A `Controller` can be constructed easily:

    import {Controller} from 'react-ringa';
    
## 1.1. Options

## 2. Listening for Events

## 3. Using Executors

Every Ringa JS `Controller` listens to a `Bus` object for events by their String type:


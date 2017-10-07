# Model

The Ringa Model class is a core part of the framework that is not necessary to use but provides a significant
amount of powerful functionality.

The Ringa Model class provides:

* Property management
* Property watching
* Built in tree structure (optional)
* Cloning (recursive)
* Serialization / deserialization (recursive)
* Trie-based indexing for search (recursive)

## Example

    import {Model} from 'ringa';
    
    class UserModel extends Model {
      constructor(name, values) {
        super(name, values);
        
        this.addProperty('firstName');
        this.addProperty('lastName');
        this.addProperty('email');
      }
    }

In this example, the `UserModel` is configured with three properties that by default:

1. Can be watched for changes
2. Will be included when serializing / deserializing

## 1.1 Watching / Observing

Using the above Class `UserModel`, we could do the following:

    let user = new UserModel();
    
    user.watch(signal => {
      console.log(`A property has changed '${signal}': ${user[signal]}`);
    });
    
    user.firstName = 'Saajan';

The console will now output:

    A property has changed 'firstName': Saajan

## 1.2 Model Property Defaults

You can specify default values for `Model` properties easily:

    class Airplane extends Model {
      constructor(name, values) {
        super(name, values);

        this.addProperty('altitude', 0);
      }
    }

All properties in the `Model` default to `undefined`. In this case, we are saying the altitude should start, as it should, at `0`.

    let airplane = new Airplane();
    
    console.log(airplane.altitude);

Output:

    0

## 1.3 Model Property Options (`propertyOptions`)

The third parameter to `addProperty` is an optional options `Object`:

    class Airplane extends Model {
      constructor(name, values) {
        super(name, values);

        this.addProperty('altitude', 0, {
          description: 'This is the altitude of the airplane.'
        });
      }
    }

All property options can be accessed through the `propertyOptions` dictionary:

    let airplane = new Airplane();
    
    console.log(airplane.propertyOptions.altitude.description);
    
Output:

    This is the altitude of the airplane.

**Be careful! If you accidentally pass the property options as the second parameter to `addProperty` they will be treated as the default value.**

Note: the following propertyOptions are reserved and used by Ringa:

* `descriptor`
* `setParentModel`
* `autowatch`
* `doNotNotify`
* `clone`
* `type`
* `serialize`
* `get`
* `set`

## 1.4 Custom Getters / Setters

By default, Ringa uses `Object.defineProperty` every time you call `addProperty()` to create a custom getter / setter on your model.

However, you can override this quite easily:

    import {Model} from 'ringa';
        
    class UserModel extends Model {
      constructor(name, values) {
        super(name, values);
        
        this.addProperty('address', undefined, {
          set: value => {
            this._address = value ? value.toUpperCase();
            this.notify('address');
          },
          get: () => {
            return this._address;
          }
        });
      }
    }

*Note: if you override the internal setter you will not get any of the built in notification features unless you call them yourself!*

## 2. Notifications

By default, Ringa Models automatically dispatch (notify) a new signal that matches the property name when that property changes in value.

    user.watch(signal => console.log);
    
    user.firstName = 'Josh');
    
Output:

    firstName

But if the property does not change in value, then no signal is dispatched:

    // Signal 'firstName' is dispatched first time!
    user.firstName = 'Saajan'; 

    // Signal 'firstName' is NOT dispatched, because property has not changed
    user.firstName = 'Saajan'; 

### 2.1. Custom Notifications

One cool feature of the Ringa `Model` is that you can notify your own custom signals:

    let user = new UserModel();
        
    user.watch(signal => {
      if (signal === 'update') {
        doSomeHugeTask();
      }
    });
    
    user.firstName = 'Saajan';
    user.lastName = 'Smith';
    user.email = 'saajan@somewhere.com';
    
    user.notify('update');

### 2.2. Turning off Notifications

Another cool feature of the Model is that you can turn off notifications to improve performance by using the property options:

    import {Model} from 'ringa';
        
    class UserModel extends Model {
      constructor(name, values) {
        super(name, values);

        this.addProperty('firstName', {doNotNotify: true});
        this.addProperty('lastName', {doNotNotify: true});
      }
      
      get fullName() {
        return `${this.firstName} ${this.lastName}`;
      }
    }
    
    ...
    
    user = new UserModel();
    
    user.watch(signal => {
      if (signal === 'change') {
        console.log('The name has changed! ${user.fullName}');
      }
    });
    
    user.firstName = 'Saajan';
    user.lastName = 'Smith';
    
    user.notify('change');
    
In the above example, to increase performance we notify a special event when either the `firstName` or `lastName` has changed.

### 2.3 Aggregating Complex Properties

A lot of observable frameworks like MobX and Angular attempt to deduce what you want updated by reading complex strings that combine filtering, sorting, etc. Many of
them do this by parsing the string, breaking it down into variable names, and then watching all the variables for updates.

Unfortunately, at the beginning of a smaller project this is really helpful but it causes several problems especially as a project scales:

1. Bindings can begin to cause unpredicable performance drops when updating a single variable causes a huge tree of observables to be triggered.
2. Including complex math or array reduce / map / filters inside of strings limits your IDEs ability to parse some of your most important code.

My goal with Ringa was to avoid these two problems as much as possible. As a result, the Models in Ringa give most of the power of these updates to you, the developer.

Nothing in Ringa updates unless you explicitly tell it to.

See the next section (2.4) for an example of how to more complex operations triggered by a property change. 

### 2.4 Watching changes with `onChange`

If you want to do complex operations, you can do so like this:

    import {Model} from 'ringa';
            
    class Collection extends Model {
      constructor(name, values) {
        super(name, values);

        this.addProperty('data');  // Input array (immutable)
        this.addProperty('items', {
          get: () {
            return this.data ? this.data.filter(this.filter) : [];
          }
        }); // Output array (determined by filter)
        
        this.addProperty('filter', {
          onChange: (oldValue, newValue) => {
            this.notify('items');
          }
        });
      }
    }
    
*Note: `onChange` only gets called if the value of the property `filter` above actually changes to a new value.*

Now, when `filter` changes, an `items` signal will be dispatched:

    let collection = new Collection();

    collection.watch(signal => {
      if (signal === 'items') {
        console.log("Items are now: ${collection.items.join(',')}");
      }
    });

    collection.data = [1, 2, 3];
    collection.filter = value => value !== 2;
    
Output:

    1, 3

This notification feature of models is the foundation of the high performance of Ringa because nothing happens that you do not 
explicitly tell Ringa to do, so you can avoid all the performance bottlenecks from the beginning that tend to bog down enterprise software.
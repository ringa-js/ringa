# Model

* Extends [`Bus`](/bus)
* Extends [`RingaObject`](/ringaObject)


    import {Model} from 'ringa';

The Ringa `Model` class is an optional, but core part of the framework that is a hybrid between a traditional view and data model:

It provides:

* Property management
* Property watching
* Built in tree structure (optional)
* Cloning (recursive)
* Serialization / deserialization (recursive)
* Trie-based indexing for search (recursive)

## Example `UserModel`

The following model will be used as an example throughout this document:

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
3. Will be cloned if `clone()` is called

## 1. Basics

    Model(name, values)
    
The Ringa `Model` constructor takes in an optional `name` string and optional `values` object. If the first property is an `Object` then it is assumed to be the `values` object.

Every new Ringa `Model` instance has the following base properties:

* **`id`**: inherited from `RingaObject`, a unique identifier for this model. A console warning will be issued if two `RingaObjects` contain the same id so try not to reuse these (although it is necessary in some cases due to cloning). By default `id` is the Model class Constructor name followed by a number that is the number of Models that have been created so far for this type.
* **`name`**: a human-readable name for the model. It is assumed that more than one model may have the same name. By default the `name` property is the Model class Constructor name in camelcase.
* **`_values`**: passed in to the constructor, these are optional defaults for each property. Note that the values are stored in the `_values` property, not `values` since they are to be treated as protected members.

Using the example `UserModel` class above we could do the following:

    let userModel = new UserModel();
    
    console.log(`id: ${userModel.id}`);
    console.log(`name: ${userModel.name}`);
    console.log(`_values: ${userModel._values}`);

Output:

    id: UserModel1
    name: userModel
    _values: undefined

The only way to set the `id` property through the constructor is to use the `values` argument. The reason for this is that often you want to instantiate a model from a POJO that contains the id:

    let userModel = new UserModel({
      id: 'someCustomId'
    });
    
    console.log(`id: ${userModel.id}`);
    console.log(`_values:`, userModel._values);

Output:

    id: someCustomId
    _values: {id: 'someCustomId'}

If you desire to have your properties initialized immediately with different values than the Class defaults, you can provide those properties through the `values` object as well:

    let me = new UserModel('joshuaJung', {
      firstName: "Joshua",
      lastName: "Jung"
    });
    
## 1.1. Model Properties

You add properties to a Model with the `addProperty` method:

    addProperty(name, defaultValue, options);

* **name**: the name of the property.
* **defaultValue**: the default value of the property.
* **options**: a variety of options on how the property works. Discussed in the following sections.

### 1.1.1. Model Property Name

`addProperty` automatically constructs a getter / setter on your Model instance and internally stores the value of the property in the underscored name:

    class MyModel extends Model {
      constructor(name, values) {
        super(name, values);
        
        this.addProperty('someProperty');
      }
    }
    ...
    let myModel = new MyModel();
    myModel.someProperty = 'to be or not to be';
    
    console.log(myModel._someProperty);
    
Output:

    to be or not to be

**Node: a future version of Ringa should attach the getter / setter for properties to the internal `prototype` for performance if possible.**

### 1.1.2. Model Property Defaults

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

### 1.1.3. Model Property Options (`propertyOptions`)

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

### 1.1.4. Property Getters / Setters

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

## 1.2. Watching / Observing Models

Model's can be watched for property value changes or even custom signals.

*Note: signals are similar to lightweight events but are not the same! Signals are only a string and do not contain a detail object. In addition signals are automatically dispatched through the ancestors of a model so that parent models can listen when properties of their children change.*

Using the Example Class `UserModel` defined at the beginning of this page, we could do the following:

    let user = new UserModel();
    
    user.watch(signal => {
      console.log(`A property has changed '${signal}': ${user[signal]}`);
    });
    
    user.firstName = 'Saajan';

The console will now output:

    A property has changed 'firstName': Saajan

# 2. Advanced Features

While all the following features are optional, they are all designed to work together seamlessly to serve every need you could have for a Model. For the best results, I recommend reading on each of the following features to get the most mileage and reuse from your Ringa models.

## 2.1. Cloning

Ringa `Models` can easily be cloned:

    let userModel = new UserModel();
    
    let clonee = userModel.clone();

In some cases you may not want to clone the `id` and instead want the cloned object to grab a new unique identifier:

    let clonee = userModel.clone({
      cloneId: false
    });
    
    console.log(clonee.id);
    
Output:

    UserModel2
    
*Note: in 2.3 we will explain how Ringa models can be structured like a tree. The `clone()` method is recursive on all descendants.*

## 2.2. Serialization

Every Ringa `Model` has highly customizable built-in serialization and deserialization. By default both serialization and deserialization are recursive in a `Model` tree (see section 2.3).

By default, only properties that have been added with `addProperty` are serialized or deserialized. 

### 2.2.1. Serializing

To serialize a Ringa `Model`:

    let pojo = myModel.serialize();
    
There are lots of options for serializing Ringa models:

* Override the `serializeId` getter on any `Model` to customize the `id` property for serialization.
* Implement the `serializeProperties` getter on any `Model` to return an Array of properties to be serialized for that `Model`.

For example:

    class MyModel extends Model {
      constructor(name, values) {
        super(name, values);
        
        this.addProperty('text', 'hello world');
        this.addProperty('hiddenText', 'we refuse to be serialized');
      }
      
      get serializeId() {
        return this.id + '_serialized';
      }
      
      get serializeProperties() {
        return ['text']; // Not necessary to include id
      }
    }
    ...
    console.log(new MyModel().serialize());
    
Output

    {
      "id": "MyModel1_serialized",
      "text": "hello world"
    }

### 2.2.2. Deserializing

Basic deserialization is easy. Assuming the `UserModel` example used at the beginning of this page:

    let pojo = {
      id: "12345678",
      firstName: "Joseph",
      lastName: "Williams",
      email: "jwilliams@somewhere.com"
    };

    let userModel = Model.deserialize(pojo, {
      type: UserModel
    });
    
`Model.deserialize` will instantiate a new `UserModel` instance and populate each of its properties with values from the POJO (if they exist).

For simple cases this is sufficient. However, with trees of models, deserialization can be a lot more complicated. Since the serialized JSON object does not include information on what type of Javascript model it should be serialized back into, you need
to provide the information yourself.

This can be done in several ways:

1. Provide a `type` option for the root model
2. Set `type` on the property option (for properties)
3. Provide a `modelMapper` `Function` to the deserialize options.

#### 2.2.2.1. Deserializing: `type` option

As shown above, you can provide a `type` property to the deserialize options:

    let myModel = Model.deserialize(pojo, {
      type: MyModel
    });
    
Note that the type provided must extend `Model`.

#### 2.2.2.2. Deserializing: `type` property option

For individual properties, you can specify the type when calling `addProperty` (including Arrays) and deserialization will instantiate a new `Model` of that type and deserialize into it:

    class FamilyTreeNode extends Model {
      constructor(name, values) {
        super(name, values);
        
        this.addProperty('quote');
        
        this.addProperty('children', undefined, {
          type: FamilyTreeNode
        });
      }
    }
    ...
    let pojo = {
      quote: "I'm a father of two children!",
      children: [{
        quote: "I hate dad jokes."
      }, {
        quote: "I, also, hate dad jokes."
      }]
    };
    
    let myModel = Model.deserialize(pojo, {
      type: FamilyTreeNode
    });
    
In this case, three instances of `FamilyTreeNode` will be constructed, and two of them will exist inside of the `children` property of the parent node.

#### 2.2.2.3. Deserializing: `modelMapper` option

In some cases, you may have a large tree of models and you are not sure beforehand what the types passed in will be. As a result you may
need to inspect the JSON object for custom indicators to determine its type.

For this situation, you can use the `modelMapper` `Function` option:

    class TextModel {...};
    class NumberModel {...};
    
    let modelMapper = (pojo, options) => {
      if (pojo.hasOwnProperty('text') {
        return TextModel;
      } else if (pojo.hasOwnProperty('number') {
        return NumberModel;
      }
    };
    
    let somePojo = {...};
    let myModel = Model.deserialize(somePojo, {modelMapper});

In this example, if `somePojo` has a property named `text` then the deserializer will make a new `TextModel`. If it has a property named `number` then the deserializer will
make a `NumberModel`.

**Note: the `modelMapper` is passed recursively in the same options object to all descendants that are deserialized as well.**
 
## 2.3. Model Trees

Ringa Models are designed to be linked together in tree structures to make monitoring changes in a large collection of models easier.

In addition, this structure allows you to serialize, deserialize, index, and clone large recursive model structures with ease.

### 2.3.1. Autowatching and linking child `Models`

Every `Model` object watches each property for changes and if a property is set to another `Model` object then an internal tree structure is automatically created:

    class TreeNode extends Model {
      constructor(name, values) {
        super(name, values);
        
        this.addProperty('child');
        this.addProperty('text');
      }
    }
    
    ...
    
    let parent = new TreeNode('parent');    
    let child = new TreeNode();
    
    parent.child = child;
    
    console.log('Parent is:', child.parentModel.name);
    console.log('Children are:', parent.childIdToRef);
    
Output:

    Parent is: parent
    Children are:
    {
      TreeNode2: TreeNode
    }

In addition to watching their properties and linking to their child `Models`, every `Model` by default watches every single child `Model` for property changes and dispatches a dot-notation signal when any descendant has a change:

    ...
    parent.watch(signal => console.log);
    
    child.text = 'Hello World';

Output:

    child.text

The purpose of this structure is so that you can create incredibly complex model trees (like an intricate layered form) and listen for changes from any node in the entire tree and respond to the change.

For example, imagine a complex Form with groups and nodes. If you watch the root node, anytime a property anywhere in the tree changes at any node, you could trigger a validation method or an auto-save to the database without having to explicitly watch every single node in the tree or even know the size of the tree.

### 2.3.2. Watching child `Models` in Arrays or Objects

Note that for Arrays or Objects, in the current version you will need to manually link children to their parents. To do so you call `addModelChild`:

    class TreeNode extends Model {
      constructor(name, values) {
        super(name, values);
        
        this.addProperty('children');
      }
    }
    
    ...
    
    let parent = new TreeNode('parent');    
    let child = new TreeNode();
    
    parent.children = [child];
    
    parent.addModelChild('children', child);
    
The first argument to `addModelChild` is the property that the parent can find that child within.

The reason I left this to you as a manual exercise is so that no loops over children are done without your knowledge.

## 2.4. Notifications / `notify()`

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
    
The handler method for a notification has the following signature:

    myModel.watch((signal, signaler, value, descriptor) => {});

* **signal**: the String signal (e.g. `'firstName'`). Will match the property name that has changed by default.
* **signaler**: the `Model` that dispatched the signal. Useful in Model trees.
* **value**: the value of the property that changed (if associated with a property).
* **descriptor**: a plain-text description of the signal (intended for use with a history feature).

### 2.4.1. Custom Notifications

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

### 2.4.2. Turning off Notifications

For the sake of performance, you can turn off notifications by using the property option `doNotNotify`:

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
    
In the above example, we notify a special event when either the `firstName` or `lastName` has changed. This structure keeps the properties
`firstName` and `lastName` in the serialization, indexing, and cloning while reducing the overhead of notifications for each one which is especially noticeable
in deeply nested trees of Models.

Also note that the property `fullName` - which may be useful in your view - is not included in the serialization / deserialization or cloning.

This is the standard way that I recommend implementing aggregate properties. 

## 2.5. Aggregate Properties

A lot of observable frameworks like MobX and Angular attempt to deduce what you want updated by reading complex strings that combine filtering, sorting, etc. Many of
them do this by parsing the string, breaking it down into variable names, and then watching all the variables for updates.

Unfortunately, at the beginning of a smaller project this is really helpful but it causes several problems especially as a project scales:

1. Bindings can begin to cause unpredicable performance drops when updating a single variable causes a huge tree of observables to be triggered.
2. Including complex math or array reduce / map / filters inside of strings limits your IDEs ability to parse some of your most important code.

My goal with Ringa was to avoid these two problems as much as possible. As a result, the Models in Ringa give most of the power of these updates to you, the developer.

## 2.6. Watching property changes with `onChange`

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

## 2.7 Indexing (Trie) and the `index` option for search

The Ringa `Model` object allows you to index your models (recursively) using a fast-lookup [Trie search](https://www.npmjs.org/trie-search). This is especially useful for type-ahead
searches:

    class TextModel extends Model {
      constructor(name, values) {
        super(name, values);
        
        this.addProperty('text', {index: true});
        
        this.addProperty('children', {type: TextModel});
      }
    }
    
    ...
    
    // Assume that tree is a deeplyl nested tree of TextModel objects
    
    tree.index(true);
    
    let arrayOfModelsThatHaveHello = tree.get('hello');
    
In this example, the call to `index()` builds a new Trie internal to the root `tree` model. It indexes every single property that has been added with `index` set to true.

The index method has the following signature:

    index(recurse = false, trieSearchOptions = {}, trieSearch = undefined)
    
* **recurse**: whether to recurse into child models and their indexed properties.
* **trieSearchOptions**: these options will be passed into the Trie search. See the [documentation](https://www.npmjs.org/trie-search) for details.
* **trieSearch**: if you want to provide your own instance of the Trie, you may pass it in here. If none is passed, a new one is constructed automatically.

Indexing is not performed automatically, you must call `index()` yourself. Also please do not call `index()` more often than is necessary as building the indexing structure
is time-intensive on large model trees.

**Note: the `addIndexedPropery()` method can be used instead of `addProperty(name, {index:true})`.
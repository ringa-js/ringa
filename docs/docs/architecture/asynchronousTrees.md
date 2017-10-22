# Asynchronous Trees

As a general rule, whenever the controller is told to do something we should always assume it is asynchronous. The reason is that if an action changes from synchronous to asynchronous we do not want to have to update any of the other code in the controller or the application.

This is the underlying rule behind the development of Javascript Promises: provide a core pattern and library for developers to follow to add asynchronous code to their application.

Ringa JS was originally developed before promises and it provided a unique solution. That said, it does have built-in support for promises so that your team can get the best of both worlds.

# Decouple View from Asynchronous Control

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

The first major advantage of promises is the ability to add a `catch()` call at any point and intercept problems. Promises essentially unified what everyone was doing with callbacks.

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
    Ringa.dispatch('getUserByUsername', { username });

A Ringa command tree is analogous to a tree of processes to be run, with special rules on what to do when one has completed.

`Ringa.Controller`s manage:

* **Injection**
  * Injection of appropriate objects into each command by name
  * Failing gracefully when a parameter is missing
* **Parallels**
  * Commands can be chosen to run in parallel and Ringa does not pass execution onto the next command until all parallel commands have completed
* **Failure**
  * All commands can call `fail()` or `throw` an error and the `Ringa.Controller` gracefully handles the issue
  * All `RingaEvent`s can be cancelled and every command in the command tree that has already run has the ability to roll back their last action as a response
* **Any Executor Type**
  * Promises
  * Events (DOM or CustomEvent)
  * Functions
  * Timeouts
  * Custom executors
* **Sharing**
  * Commands can be shared across controllers
  * Events can be caught by multiple controllers
* **Interception**
  * Controllers can listen for events from other controllers in the DOM heirarchy to intercept events (capture phase) or add additional functionality (bubble phase)

Because the command tree is defined in your controller before it is ever triggered, you can easily see the entire structure of what *should* happen in your application without having to inspect a lot of code. In addition because the business logic of each command is separated from the controller itself, you do not have to wade through the business logic to view the overall structure.

Ringa splits your application into sky and ground view helping you navigate from both directions:

* *Controller*: sky view of every possible thing your controller can respond to and the tree of commands it produces.
* *Command*: ground view of the responsibility of this particular command.

The possibilities are endless in how you respond to a command and you can mix and match complex asynchronous and synchronous processes together as a response to events.

# ring
Ring JS: a framework and set of design patterns for the complete data and action lifecycle of a highly modularized
and scalable Javascript application.

Specializing in support for:

- ReactJS / Angular
- Modules
- Plugins
- Scalability
- Customization
- Debugging

Unlike a lot of other MV* style frameworks in existence, Ring works closely with the DOM event system and the DOM tree
so that your Model and Control structure are loosely tied to the tree structure of your application.

# Asyncronous Nightmares no More

A Ring Controller listens for events on a DOM node and responds to each event with a type of
AST. However, unlike a standard AST, each node is by default asynchronous, analogous
to promises and functioning in a similar way to the process tree of an operating system.

Ring is designed from the ground up so that everyone from the team lead to new hires can rapidly browse a few files to
grasp the scope and functionality of each module in the application without getting lost in business code. The internals
of the framework are built to be both highly extensible and ensure consistency during scale.

Here is an example of a chat application controller:

    const INITIALIZE = 'initialize';
    const SHOW_LOGIN_MODAL = 'requestLogin';
    const LOGIN_WITH_COOKIE = 'loginWithCookie';
    const FINISH_LOGIN = 'finishLogin';
    
    class ChatController extends Ring.Controller {
      constructor(id, domNode) {
        super(id, domNode);
        
        const chatModel = new ChatModel();
        
        this.options.injections = {chatModel};
        
        this.addListener(INITIALIZE, [
          SetupApplicationModel,
          LoadApplicationData,
          Ring.bind(ShowLoadingOverlay, 'Setting up application....'),
          LOGIN_WITH_COOKIE,
          iif((chatModel) => {return !chatModel.loggedIn},
              SHOW_LOGIN_MODAL, // chatModel.loggedIn === false
              FINISH_LOGIN),    // chatModel.loggedIn == true
          HideLoadingOverlay
        ]);
        
        this.addListener(LOGIN_WITH_COOKIE, [
          GetCookieLoginInfo,
          Login
        ]);
        
        this.addListener(SHOW_LOGIN_MODAL, [
          ShowLoginModal
        ]);
        
        this.addListener(FINISH_LOGIN, [
          Ring.bind(ShowLoadingOverlay, 'Loading user information...'),
          [ 
            LoadUser,         // Run in parallel!
            LoadUserContacts, // ^
            LoadUserSettings  // ^
          ],
          HideLoadingOverlay
        ]);
      }
    }
    
    ...
    
    Ring.dispatch(INITIALIZE);
    
Each item in the event listener is assumed to be asynchronous but by chaining them all
together you get the sensation of easy-to-read synchronous code without the hassle of trying
to track down promises.

# Highly Debuggable

While Ring works with standard DOM events like `'click'`, every dispatched `RingEvent` instance
includes within it all the information necessary to debug the entire lifecycle of the entire tree
that it triggered.

Every single Class in the Ring framework is handcrafted to ensure that you never get lost in your own code. 
For example, you can see on the event itself the stack trace of where it was dispatched. In addition, every
error message dispatched by Ring tells you exactly what was happening and includes the context of what went
wrong, making logging of errors in your application easy to do.

# Modular

Because Ring is not bound to any particular GUI-related framework like React or Angular and because 
Ring can respond to any events dispatched on the DOM, it lends itself to enterprise applications where
different sections of the DOM tree might be using different versions of Ring or may be using different
versions of another GUI framework.

This approach lends itself to large applications where each section of the application might be loaded from
a different library or repository but a team may struggle to make sure every single dependency is on the same
version.

Each Ring Controller is attached to a single node on the DOM tree and listens for events on that node. As a result
each Ring Controller can listen for any bubbling events for that section of the tree only. There is no concept of a
global godlike event emitter. Beacuse of this, you can cordone off portions of the DOM tree to function differently
and can intercept events at deep nodes from reaching the root during the bubbling phase *or* intercept events from
reaching descendents during *capture* phase - just like you bubbling and capture events like 'click' and 'mouseover'!

# Rapid Prototyping

# Promise Support

Do you already use promises for a lot of your current codebase? Ring has built-in support for JS
promises at every level of its event handling system.


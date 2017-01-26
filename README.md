# ringa

Ringa is yet another Javascript control library designed to make writing code fun and extremely organized.
 
Ringa is designed for applications that are expected to substantially scale over time and for developing shared libraries.

# install

    npm install ringa

# quick example

In `MyController.js`:

    import Ringa from 'ringa';
    
    class MyController extends Ringa.Controller {
      constructor(domNode) {
        super('MyController', domNode);

        this.addListener(MyController.MY_EVENT, [
          (ringaEvent) => {ringaEvent.detail.count++}
        ]);
      }
    }
    
    MyController.MY_EVENT = 'myEvent';
    
    export default MyController;

In `MyComponent.js` (in this case ReactJS):

    this.controller = new MyController(this.getDOMNode());

    Ringa.dispatch(MyController.MY_EVENT, {count: 0});

# philosophy

In 2008, Adobe Flash - and Flex - were all the rage for web GUI. But the process of managing asynchronous calls and organizing the lifecycle of
user interaction to server calls and back to interface updates was a wild west. Adobe introduced Cairngorm, a lightweight event-to-commmand pattern
built around a central event dispatcher.

But as the Flex community grew developers began to share concerns with some of the patterns that Cairngorm introduced. Before long there were
a plethora of options from Swiz to Parsley to PureMVC.

For Actionscript, we eventually built our own solution that combined all the best parts of all the available MV* frameworks.
 
Javascript is a wild west right now too with Alt, Flux, Redux and all its extensions. Just like Cairngorm, Redux promises a super lightweight and
simple solution to a host of problems. However, becuse it is so unopinionated this means every implementation feels radically different.

Recognizing the same dilemma facing Actionscript developers back in 2008, we have loosely taken the best philosophies of our in-house solution that
worked for years with Adobe Flex and rebuilt them for Javascript.
 
# technology

Ringa is ES6 and depends only on the DOM and the internal event system of the browser.

Because of its independence from any particular GUI framework, it specializes in:

- Modules
- Plugins (ReactJS, Angular, React-Native)
- Scalability
- Customization
- Debugging

# architecture

Ringa works closely with the DOM event system and the DOM tree so that your Model and Control structure are loosely tied to the tree structure of your application.

# asyncronous nightmares be gone

A Ringa Controller listens for events on a DOM node and responds to each event with a type of
AST. However, unlike a standard AST, each node is by default asynchronous, analogous
to promises and functioning in a similar way to the process tree of an operating system.

Ringa is designed from the ground up so that everyone from the team lead to new hires can rapidly browse a few files to
grasp the scope and functionality of each module in the application without getting lost in business code. The internals
of the framework are built to be both highly extensible and ensure consistency during scale.

Here is an example of a chat application controller:

    const INITIALIZE = 'initialize';
    const SHOW_LOGIN_MODAL = 'requestLogin';
    const LOGIN_WITH_COOKIE = 'loginWithCookie';
    const FINISH_LOGIN = 'finishLogin';
    
    class ChatController extends Ringa.Controller {
      constructor(id, domNode) {
        super(id, domNode);
        
        const chatModel = new ChatModel();
        
        this.options.injections = {chatModel};
        
        this.addListener(INITIALIZE, [
          SetupApplicationModel,
          LoadApplicationData,
          bind(ShowLoadingOverlay, 'Setting up application....'),
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
          bind(ShowLoadingOverlay, 'Loading user information...'),
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
    
    Ringa.dispatch(INITIALIZE);
    
Each item in the event listener is assumed to be asynchronous but by chaining them all
together you get the sensation of easy-to-read synchronous code without the hassle of trying
to track down promises.

# debuggable

While Ringa works with standard DOM events like `'click'`, every dispatched `RingaEvent` instance
includes within it all the information necessary to debug the entire lifecycle of the entire tree
that it triggered.

Every single Class in the Ringa framework is handcrafted to ensure that you never get lost in your own code. 
For example, you can see on the event itself the stack trace of where it was dispatched. In addition, every
error message dispatched by Ringa tells you exactly what was happening and includes the context of what went
wrong, making logging of errors in your application easy to do.

# modular

Because Ringa is not bound to any particular GUI-related framework like React or Angular and because 
Ringa can respond to any events dispatched on the DOM, it lends itself to enterprise applications where
different sections of the DOM tree might be using different versions of Ringa or may be using different
versions of another GUI framework.

This approach lends itself to large applications where each section of the application might be loaded from
a different library or repository but a team may struggle to make sure every single dependency is on the same
version.

Each Ringa Controller is attached to a single node on the DOM tree and listens for events on that node. As a result
each Ringa Controller can listen for any bubbling events for that section of the tree only. There is no concept of a
global godlike event emitter. Beacuse of this, you can cordone off portions of the DOM tree to function differently
and can intercept events at deep nodes from reaching the root during the bubbling phase *or* intercept events from
reaching descendents during *capture* phase - just like you bubbling and capture events like 'click' and 'mouseover'!

# decoupled

Because the chains of commands built in Ringa are centralized and 100% decoupled from the view, it is super easy to swap
out an entire chain of functionality - or a portion of functionality - in one location to test out new business logic.

In addition, because Ringa is view agnostic it can be used with any view and so hotswapping your views while not touching
your business logic is a breeze.

# reuse

Commands, commands chains, and controllers in Ringa are designed from the ground up to be both extensible and overridable.

Do you have standard functionality for displaying loading indicators, notifications, or error handling in your application?
Write the commands for this once and reuse them in all of your controllers by easily stringing them together in your
command chains.

Want to reuse the majority of the command chains in another controller but add a few new items? Extend your other controller
and add a few new command chains!

# organized

Ringa takes an out-of-the-box opinionated approach to where things go in your application. This makes moving between Ringa
modules and applications a breeze for team leads or new developers. Jumping into a Ringa application feels familiar, without
limiting what you can do.

# promise support

Do you already use promises for a lot of your current codebase? Ringa has built-in support for JS promises at every level
of its event handling system.


import Controller from '../../src/Controller';

class TestController extends Controller {
  postInvokeHandler(ringaEvent, commandThread) {
    // this is really bad practice because it kinda creates a memory leak if you were
    // to keep this event around. this is only for unit tests.
    ringaEvent.commandThread = commandThread;
  }
}

export default TestController;
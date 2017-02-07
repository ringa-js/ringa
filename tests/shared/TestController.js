import Controller from '../../src/Controller';

class TestController extends Controller {
  constructor(id, domNode, options) {
    super(id, domNode, options);

    this.mounted = false;
  }

  postInvokeHandler(ringaEvent, thread) {
    // this is really bad practice because it kinda creates a memory leak if you were
    // to keep this event around. this is only for unit tests.
    ringaEvent.thread = thread;
  }

  busMounted() {
    this.mounted = true;
  }
}

export default TestController;
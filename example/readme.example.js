import {Controller, Model, dispatch} from '../src/index';

class CountModel extends Model {
  set count(value) {
    this._count = value;

    this.notify('countChanged');
  }

  get count() {
    return this._count;
  }
}

class BlastoffController extends Controller {
  constructor() {
    super('Blastoff Controller', document); // Attach to document (DOM node)

    this.addModel(new CountModel('countModel')); // Add a model, accessible and injectable by its id

    // 1) inject 'countModel'
    // 2) inject 'millis' by name from the dispatched events detail object
    // 3) provide a 'done' and 'fail' callback (function could also return a Promise)
    let decrement = (countModel, millis, done, fail) => {
      setTimeout(() => {
        countModel.count--;

        if (countModel.count < 0) {
          fail('Uh oh, countdown failed!');
        }

        done();
      }, millis);
    };

    // Automatically creates BlastoffController.RUN_COUNTDOWN
    this.addListener('runCountdown', [
      (countModel, startMessage) => {
        console.log(startMessage);

        countModel.count = 5;
      },
      decrement,
      decrement,
      decrement,
      decrement,
      decrement,
      (finalMessage) => {
        console.log(finalMessage);
      },
    ]);
  }
}

let controller = new BlastoffController();

// Watch our model by its model id and wait for the notification event 'countChanged'
// 'count' is injected by name, but we could inject other model properties too
controller.watch('myModel', 'countChanged', (count) => {
  console.log(count); // 5, 4, 3, 2, 1, 0...
});

dispatch(BlastoffController.RUN_COUNTDOWN, {
  startMessage: 'Starting Countdown...',
  finalMessage: 'Blastoff!',
  millis: 1000
}, document);
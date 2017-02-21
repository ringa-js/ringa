import Model from '../Model';
import {ids} from '../RingaObject';

/**
 * The InspectorModel contains data that can monitor the inner activities of Ringa so you can build custom debugging utilities in your
 * display.
 */
class InspectorModel extends Model {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor() {
    super();

    if (__DEV__) {
      this.threads = [];
      this.executors = [];

      this.addProperty('ringaObjects', undefined);

      setTimeout(() => {
        this.ringaObjects = ids.map;
        this.notify('threads');
      }, 750);
    }
  }

  //-----------------------------------
  // Properties
  //-----------------------------------

  //-----------------------------------
  // Methods
  //-----------------------------------
  addThread(thread) {
    if (__DEV__) {
      this.threads.push(thread);

      this.notify('threads');
    }
  }

  removeThread(thread) {
    if (__DEV__) {
      let ix = this.threads.indexOf(thread);

      if (ix !== -1) {
        this.threads.splice(ix, 1);

        this.notify('threads');
      }
    }
  }

  addExecutor(executor) {
    if (__DEV__) {
      this.executors.push(executor);

      this.notify('executors');
    }
  }

  removeExecutor(executor) {
    if (__DEV__) {
      let ix = this.executors.indexOf(executor);

      if (ix !== -1) {
        this.executors.splice(ix, 1);

        this.notify('executors');
      }
    }
  }
}

export default InspectorModel;
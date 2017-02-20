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
      this.addProperty('threads', []);
      this.addProperty('ringaObjects', undefined);

      setTimeout(() => {
        this.ringaObjects = ids.map;
        this.notify('ringaObjects');
      }, 500);
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
}

export default InspectorModel;
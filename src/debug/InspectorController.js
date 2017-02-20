import Controller from '../Controller';
import InspectorModel from './InspectorModel';
import {ringaGlobalBus} from '../Bus';

export function inspectorDispatch(eventType, detail) {
  /**
   * do NOT require catch, in case the user is not using the Inspector
   */
  ringaGlobalBus.dispatch(eventType, detail, false);
}

export default class InspectorController extends Controller {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(name) {
    super(name, ringaGlobalBus);

    console.log('Ringa Inspector is turned on because you have attached the InspectorController in your application. THIS WILL GREATLY REDUCE PERFORMANCE. Make sure to remove the InspectorController in your final production build! Using the global bus: ', this.bus);

    if (__DEV__) {
      /**
       * We don't want this controller to also dispatch the events or else we will end up with an infinite loop of dispatches
       * which will entirely crash the browser. This MUST be set to true in the InspectorController!
       */
      this.__blockRingaEvents = true;

      this.addModel(new InspectorModel());

      this.addListener('ringaThreadStart', (inspectorModel, thread) => {
        inspectorModel.addThread(thread);
      });

      this.addListener('ringaThreadKill', (inspectorModel, thread) => {
        inspectorModel.removeThread(thread);
      });

      this.addListener('ringaExecutorStart', (inspectorModel, executor) => {
        inspectorModel.addExecutor(executor);
      });

      this.addListener('ringaExecutorEnd', (inspectorModel, executor) => {
        inspectorModel.removeExecutor(executor);
      });
    }
  }

  get bus() {
    return super.bus;
  }

  set bus(value) {
    if (value !== ringaGlobalBus) {
      return;
    }

    super.bus = value;
  }
}

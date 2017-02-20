import Controller from '../Controller';
import InspectorModel from './InspectorModel';

export default class InspectorController extends Controller {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(name, bus) {
    super(name, bus);

    if (__DEV__) {
      this.__blockRingaEvents = true;

      this.addModel(new InspectorModel());

      this.addListener('ringaThreadStart', (inspectorModel, thread) => {
        inspectorModel.addThread(thread);
      });

      this.addListener('ringaThreadKill', (inspectorModel, thread) => {
        inspectorModel.removeThread(thread);
      });
    }
  }
}
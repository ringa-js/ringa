import ExecutorFactory from '../ExecutorFactory';
import { mergeRingaEventDetails } from '../util/ringaEvent';

export default class AssignFactory extends ExecutorFactory {
  constructor(executee, detail) {
    super(executee);
    this.detail = detail;
  }

  build(thread) {
    mergeRingaEventDetails(thread.ringaEvent, this.detail, thread.controller.options.warnOnDetailOverwrite);
    
    return super.build(thread);
  }
}
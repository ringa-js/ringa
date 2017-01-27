import RingaEvent from './RingaEvent';
import { mergeRingaEventDetails } from './util/ringaEvent';


class RingaEventFactory {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(eventType, detail, domNode, requireCatch = false, bubbles = true, cancellable = true) {
    this.eventType = eventType;
    this.detail = detail;
    this.domNode = domNode;
    this.bubbles = true;
    this.cancellable = true;
    this.requireCatch = requireCatch;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  build(executor) {
    let newDetail = mergeRingaEventDetails(executor.ringaEvent, this.detail, executor.controller.options.warnOnDetailOverwrite);

    newDetail._executor = executor;
    newDetail.requireCatch = this.requireCatch;

    return new RingaEvent(this.eventType, newDetail, this.bubbles, this.cancellable);
  }

  toString() {
    return 'RingaEventFactory_' + this.eventType;
  }
}

export default RingaEventFactory;
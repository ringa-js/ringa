import RingaEvent from './RingaEvent';
import { mergeRingaEventDetails } from './util/ringaEvent';
import {getArgNames} from './util/function';
import {buildArgumentsFromRingaEvent} from './util/executors';

class RingaEventFactory {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(eventType, detail, domNode, requireCatch = false, bubbles = true, cancellable = true) {
    this.eventType = eventType;
    this.detailOrig = detail;
    this.domNode = domNode;
    this.bubbles = true;
    this.cancellable = true;
    this.requireCatch = requireCatch;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  build(executor) {
    let detail;

    if (typeof this.detailOrig === 'function') {
      let argNames = getArgNames(this.detailOrig);
      let args = buildArgumentsFromRingaEvent(executor, argNames, executor.ringaEvent);
      detail = this.detailOrig.apply(undefined, args);
    } else {
      detail = this.detailOrig;
    }

    let newDetail = mergeRingaEventDetails(executor.ringaEvent, detail, executor.controller.options.warnOnDetailOverwrite);

    newDetail._executor = executor;
    newDetail.requireCatch = this.requireCatch;

    return new RingaEvent(this.eventType, newDetail, this.bubbles, this.cancellable);
  }

  toString() {
    return 'RingaEventFactory_' + this.eventType;
  }
}

export default RingaEventFactory;
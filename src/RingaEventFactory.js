import RingaEvent from './RingaEvent';

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
  build(callee) {
    let newDetail = {};

    Object.assign(newDetail, this.detail);

    newDetail._callee = callee;
    newDetail.requireCatch = this.requireCatch;

    return new RingaEvent(this.eventType, newDetail, this.bubbles, this.cancellable);
  }

  toString() {
    return 'RingaEventFactory_' + this.eventType;
  }
}

export default RingaEventFactory;
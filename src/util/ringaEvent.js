
export function mergeRingaEventDetails(ringaEvent, detail, warnOnOverwrite = true, assignToRingEvent = true) {
  let nextDetail = Object.assign({}, detail); // Make sure we clone!!
  let prevDetail = ringaEvent.detail || {};
  
  for(var key in prevDetail) {
    if (prevDetail.hasOwnProperty(key)) {
      if (__DEV__ && nextDetail[key]!==undefined && (warnOnOverwrite || ringaEvent.debug)) {
        console.warn(`mergeRingaEventDetails(): overwriting property '${key}' on ${ringaEvent}.\n` +
                     `Old value: ${prevDetail[key]}\n` +
                     `New value: ${nextDetail[key]}\n`);
      }
      if (nextDetail[key]===undefined) {
        nextDetail[key] = prevDetail[key];
      }
    }
  }
  if (assignToRingEvent) {
    ringaEvent.detail = nextDetail;
  }
  return nextDetail;
};
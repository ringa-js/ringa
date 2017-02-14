
export function mergeRingaEventDetails(ringaEvent, detail, warnOnOverwrite = true) {
  let nextDetail = detail || {};
  let prevDetail = ringaEvent.detail || {};
  
  for(var key in prevDetail) {
    if (prevDetail.hasOwnProperty(key)) {
      if (__DEV__ && nextDetail[key]!==undefined && (warnOnOverwrite || ringaEvent.debug)) {
        console.warn(`mergeRingaEventDetails(): overwriting property '${key}' on ${ringaEvent}.\n` +
                     `Old value: ${JSON.stringify(prevDetail[key])}\n` +
                     `New value: ${JSON.stringify(nextDetail[key])}\n`);
      }
      if (nextDetail[key]===undefined) {
        nextDetail[key] = prevDetail[key];
      }
    }
  }
  ringaEvent.detail = nextDetail;
  return nextDetail;
};
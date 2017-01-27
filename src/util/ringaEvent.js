
export function mergeRingaEventDetails(ringaEvent, detail, warnOnOverwrite = true) {
  let nextDetail = detail || {};
  let prevDetail = ringaEvent.detail || {};
  
  for(var key in prevDetail) {
    if (prevDetail.hasOwnProperty(key)) {
      if (__DEV__ && nextDetail[key]!==undefined && warnOnOverwrite) {
        console.warn(`mergeRingaEventDetails(): property from previous event ${ringaEvent} will be overwritten by new details '${key}' property.`);
      }
      if (nextDetail[key]===undefined) {
        nextDetail[key] = prevDetail[key];
      }
    }
  }
  ringaEvent.detail = nextDetail;
  return nextDetail;
};
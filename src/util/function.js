/**
 * This function returns the arguments for another method as an array.
 *
 * TODO: this should give some indication in its return on which arguments are optional (e.g. func(a=1,b=2,c='whatever'))
 *
 * @param func
 * @returns {Array}
 */
export const getArgNames = function (func) {
  var s = func.toString();
  s = s.substring(s.indexOf('(')+1, s.indexOf(')'));
  s = s.replace(/[\r\n\s]*/g, '');
  s = s.replace(/\\+['"]/g, '').replace(/=\s*(["']).*?\1/g, '').replace(/=.*?(,|$)/g, '');
  return s.length !== 0 ? s.split(',') : [];
};

/**
 * This function returns a resolved promise after `milliseconds` has elapsed
 *
 * @param milliseconds
 * @returns {Promise}
 */
export const sleep = function (milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
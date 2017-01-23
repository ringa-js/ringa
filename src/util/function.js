export const getArgNames = function (func) {
  var s = func.toString();
  s = s.substring(s.indexOf('(')+1, s.indexOf(')'));
  s = s.replace(/[\r\n\s]*/g, '');
  s = s.replace(/\\+['"]/g, '').replace(/=\s*(["']).*?\1/g, '').replace(/=.*?(,|$)/g, '');
  return s.length !== 0 ? s.split(',') : [];
};
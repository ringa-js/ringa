export function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

// Returns true if it is a DOM node
// http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
export function isDOMNode(o){
  return (
    typeof Node === "object" ? o instanceof Node : 
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}

// If constructor is not in object's prototype chain,
// return object wrapped in constructor
export function wrapIfNotInstance(object, constructor) {
  if (!(object instanceof constructor)) {
    object = new constructor(object);
  }

  return object;
}
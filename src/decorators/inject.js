import {ForceUpdate} from '../';


/**
 * This is a global map of all Class types to the expected injector object.
 *
 * @type {Map}
 */
const classToInjections = new WeakMap();

/**
 * The inject descriptor is used like so:
 *
 *   @inject(ClassName)
 *   this.classInstance;
 *
 * OR
 *
 *   @inject('ObjectName')
 *   this.classInstance;
 *
 * @param classTypeOrName Either a Class reference or a string representing a requested object by name.
 * @param option Could be Ring.ForceUpdate which forces the parent class ReactDOM instance to call forceUpdate
 *               when the property is set.
 */
export default function inject(classTypeOrName, option) {
  return function(target, key, descriptor) {
    let injector = (classToInjections[target.constructor.name] = classToInjections[target.constructor.name] || {});
    injector[key] = { classTypeOrName, option };

    target.injector = injector;

    // If ForceUpdate is set, then we wrap the default setter in a method
    // that calls forceUpdate after the set has occurred.
    if (option === ForceUpdate) {
      let setter = descriptor.set;

      descriptor.set = function(value) {
        setter.call(this, value);

        this.forceUpdate();
      }
    }

    return descriptor;
  };
}
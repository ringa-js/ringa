import Injector from './Injector';

/**
 * The root injector should always exist and be attached to the root react dom node. I'm not
 * sure how we will do this yet, but that is the goal. This guarantees that there is always
 * at least one injector in a Ring application.
 */
class InjectorRoot extends Injector {

}

export default InjectorRoot;
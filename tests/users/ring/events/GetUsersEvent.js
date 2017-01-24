import Ringa from '../../index';

const GET_USERS_EVENT = 'getUsersEvent';

class GetUsersEvent extends Ringa.Event {
  constructor(properties) {
    super(GET_USERS_EVENT, properties);
  }
}

export default GetUsersEvent;
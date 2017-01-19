import Ring from '../../index';

const GET_USERS_EVENT = 'getUsersEvent';

class GetUsersEvent extends Ring.Event {
  constructor(properties) {
    super(GET_USERS_EVENT, properties);
  }
}

export default GetUsersEvent;
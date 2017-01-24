import React from 'react';
import UserCollection from '../ringa/models/UserCollection';
import { inject, ForceUpdate } from '../../../src/index';

/**
 * Displays a list of users.
 */
export class UserList extends React.Component {
  //-----------------------------------
  // Properties
  //-----------------------------------
  @inject(UserCollection, ForceUpdate)
  users = undefined;

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor
   *
   * @param properties
   */
  constructor(properties) {
    super(properties);
  }

  filterSelect(filter) {
    new RingaEvent(FILTER_USERS, {
      filter,
      userList,
      blahBlah
    });
  }
  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  /**
   * Renders the user list
   *
   * @returns {XML}
   */
  render() {
    let userMap = (user) => {
      return <li>{user.lastName}, {user.firstName}</li>;
    };

    return (
      <ul>{this.users.map(userMap)}</ul>
    );
  }
}

export default UserList;

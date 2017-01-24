import a from '../../index.js';
import GET_USER from '../Events';
import {bind, spawn, iif, event} from 'ringa';

class RC_Users extends Ringa.Controller {
  constructor(domNode) {
    super(domNode);

    this.addListener(GET_USER, [
      bind(ShowLoadingDialog, 'Get User...'),
      GetUser,
      spawn(event(SHOW_FANCY_ANIMATION, {})),
      iif((user) => {return user.isAdmin}, ShowAdminPriveleges, HideAdminPriveleges),
      iif((user) => {return user.isNew}, spawn(NEW_USER_WIZARD)),
      HideLoadingDialog
    ]);

    this.addListener(NEW_USER_WIZARD, [
      ShowSettingsButton,
      ShowDetailsPane,
      ShowNavigationBar,
      ShowAddFriendButton
    ]);
  }
}

export default RC_Users;
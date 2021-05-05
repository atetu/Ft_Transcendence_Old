import Backbone from "backbone";

import FriendshipModel from "./FriendshipModel";

const UserCollection = Backbone.Collection.extend({
  initialize([], { user }) {
    this.user = user;
  },
  url() {
    return `/api/users/${this.user.id}/friends`;
  },
  model: FriendshipModel,
});

export default UserCollection;
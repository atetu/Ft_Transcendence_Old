const Dummy = require("./components/dummy");
const Channel = require("./components/channel");
const User = require("./components/user");

export default {
  "/": {
    group: null,
    view: () => new Dummy.EmptyView(),
  },
  "/channels": {
    group: "channels",
    view: () =>
      new Channel.ChannelListView({
        collection: new Channel.ChannelCollection(),
        fetch: true,
      }),
  },
  "/channel/create": {
    group: "channels",
    view: () => new Channel.ChannelCreateOrEditView({ id: null }),
  },
  "/channel/:id": {
    group: "channels",
    view: (id) => new Channel.ChannelView({ id }),
  },
  "/channel/:id/edit": {
    group: "channels",
    view: (id) => new Channel.ChannelCreateOrEditView({ id }),
  },
  "/guilds": {
    group: "guilds",
    view: () => new Dummy.EmptyView(),
  },
  "/profile": {
    group: "profile",
    view: () => new User.UserProfileView({ user_id: current_user.id }),
  },
  "/profile/edit": {
    group: "profile",
    view: () => new User.UserProfileEditView(),
  },
  "/users": {
    group: "users",
    view: () =>
      new User.UserListView({
        collection: new User.UserCollection(),
        fetch: true,
      }),
  },
  "/user/:id": {
    group: "users",
    view: (id) => new User.UserProfileView({ user_id: id }),
  },
};

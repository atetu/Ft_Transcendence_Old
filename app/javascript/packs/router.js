import Backbone from "backbone";

const Dummy = require("./components/dummy");
const Channel = require("./components/channel");
const User = require("./components/user");

const Router = Backbone.Router.extend({
  routes: {
    ""() {
      this.setActive(null);

      this.app.setView(new Dummy.EmptyView());
    },
    channels() {
      this.setActive("channels");

      var channelCollection = new Channel.ChannelCollection();

      this.app.setView(
        new Channel.ChannelListView({
          collection: channelCollection,
        })
      );

      channelCollection.fetch();
    },
    "channel/create"() {
      this.setActive("channels");

      this.app.setView(
        new Channel.ChannelCreateOrEditView({
          id: null,
        })
      );
    },
    "channel/:id"(id) {
      this.setActive("channels");

      this.app.setView(
        new Channel.ChannelView({
          id,
        })
      );
    },
    "channel/:id/edit"(id) {
      this.setActive("channels");

      this.app.setView(
        new Channel.ChannelCreateOrEditView({
          id,
        })
      );
    },
    guilds() {
      this.setActive("guilds");

      this.app.setView(new Dummy.EmptyView());
    },
    profile() {
      this.setActive("profile");

      this.app.setView(
        new User.UserProfileView({
          user_id: current_user.id,
        })
      );
    },
    "profile/edit"() {
      this.setActive("profile");

      this.app.setView(new User.UserProfileEditView());
    },
    users() {
      this.setActive("users");

      var userCollection = new User.UserCollection();

      this.app.setView(
        new User.UserListView({
          collection: userCollection,
        })
      );

      userCollection.fetch();
    },
    "user/:id"(id) {
      this.setActive("users");

      this.app.setView(
        new User.UserProfileView({
          user_id: id,
        })
      );
    },
  },
  initialize(options) {
    this.app = options.app;
  },
  setActive(route) {
    this.app.navigationBarView.setActive(route);
  },
});

export default Router;

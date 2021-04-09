import Backbone from "backbone";

const Dummy = require("./components/dummy");
const Channel = require("./components/channel");
const User = require("./components/user");

const Router = Backbone.Router.extend({
  routes: {
    "": "home",
    channels: "channels",
    "channel/create": "channelCreate",
    "channel/:channel_id": "channelById",
    "channel/:channel_id/edit": "channelByIdEdit",
    guilds: "guilds",
	profile: "profile",
	"profile/edit": "profileEdit",
	"users": "users",
	"user/:user_id": "userById"
  },
  initialize(options) {
    this.app = options.app;
  },
  home() {
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
  channelCreate() {
    this.setActive("channels");

    this.app.setView(new Channel.ChannelCreateOrEditView());
  },
  channelById(channel_id) {
    this.setActive("channels");

    this.app.setView(
      new Channel.ChannelView({
        channel_id
      })
    );
  },
  channelByIdEdit(channel_id) {
    this.setActive("channels");

    this.app.setView(
      new Channel.ChannelCreateOrEditView({
        channel_id
      })
    );
  },
  guilds() {
    this.setActive("guilds");

    this.app.setView(new Dummy.EmptyView());
  },
  profile() {
    this.setActive("profile");

    this.app.setView(new User.UserProfileView({
		user_id: current_user.id
	}));
  },
  profileEdit() {
    this.setActive("profile");
	
    this.app.setView(new User.UserProfileEditView());
  },
  users() {
    this.setActive("users");

    var userCollection = new User.UserCollection();

    this.app.setView(new User.UserListView({
		collection: userCollection
	}));

    userCollection.fetch();
  },
  userById(user_id) {
    this.setActive("users");

    this.app.setView(new User.UserProfileView({
		user_id
	}));
  },
  setActive(route) {
    this.app.navigationBarView.setActive(route);
  },
});

export default Router;

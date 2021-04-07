import Backbone from "backbone";

const Dummy = require("./components/dummy");
const Channel = require("./components/channel");

const Router = Backbone.Router.extend({
  routes: {
    "": "home",
    channels: "channels",
    "channel/create": "channelCreate",
    "channel/:channel_id": "channelById",
    "channel/:channel_id/edit": "channelByIdEdit",
    guilds: "guilds",
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
        channel_id: channel_id,
      })
    );
  },
  channelByIdEdit(channel_id) {
    this.setActive("channels");

    this.app.setView(
      new Channel.ChannelCreateOrEditView({
        channel_id: channel_id,
      })
    );
  },
  guilds() {
    this.setActive("guilds");

    this.app.setView(new Dummy.EmptyView());
  },
  setActive(route) {
    this.app.navigationBarView.setActive(route);
  },
});

export default Router;

import Backbone from "backbone";

const Channel = require("./components/channel");

const Router = Backbone.Router.extend({
  routes: {
    "": "home",
    "channels": "channels",
    "channel/create": "channelCreate",
    "channel/:channel_id": "channelById",
    "channel/:channel_id/edit": "channelByIdEdit",
  },
  initialize(options) {
    this.app = options.app;
  },
  home() {
    console.log("home()");
    //console.trace();
  },
  channels() {
    console.log("channels()");

    var channelCollection = new Channel.ChannelCollection();

    this.app.setView(
      new Channel.ChannelListView({
        collection: channelCollection,
      })
    );

    channelCollection.fetch();
  },
  channelCreate() {
    console.log("channelCreate()");

    this.app.setView(new Channel.ChannelCreateOrEditView());
  },
  channelById(channel_id) {
    console.log("channelById(" + channel_id + ")");

    this.app.setView(
      new Channel.ChannelView({
        channel_id: channel_id,
      })
    );
  },
  channelByIdEdit(channel_id) {
    console.log("channelByIdEdit(" + channel_id + ")");

    this.app.setView(
      new Channel.ChannelCreateOrEditView({
        channel_id: channel_id,
      })
    );
  },
});

export default Router;

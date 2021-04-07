import Backbone from "backbone";

const Channel = require("./components/channel");

const Router = Backbone.Router.extend({
  routes: {
    "": "home",
    channels: "channels",
    "channel/create": "channelCreate",
    "channel/edit/:channel_id": "channelEditById",
    "channel/:channel_id": "channelById",
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
  channelEditById(channel_id) {
    console.log("channelEditById(" + channel_id + ")");

    this.app.setView(
      new Channel.ChannelCreateOrEditView({
        channel_id: channel_id,
      })
    );
  },
  channelById(channel_id) {
    console.log("channelById(" + channel_id + ")");

    this.app.setView(
      new Channel.ChannelView({
        channel_id: channel_id,
      })
    );
  },
});

export default Router;

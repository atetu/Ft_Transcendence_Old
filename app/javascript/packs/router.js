import Backbone from "backbone";

const Dummy = require("./components/dummy");
const Channel = require("./components/channel");
const Game = require("./components/game");

const Router = Backbone.Router.extend({
  routes: {
    "": "home",
    channels: "channels",
    "channel/create": "channelCreate",
    "channel/:channel_id": "channelById",
    "channel/:channel_id/edit": "channelByIdEdit",
    guilds: "guilds",
    "games": "gameNew",
    "game/:game_id": "gameById",
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
  gameNew()
  {
    this.setActive("games");

    this.app.setView(new Game.GameView());
  },
  gameById(game_id) {
    this.setActive("games");

    this.app.setView(
      new Game.GameView({
        game_id: game_id,
      })
    );
  },
  setActive(route) {
    this.app.navigationBarView.setActive(route);
  },
});

export default Router;

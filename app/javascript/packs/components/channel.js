import Backbone from "backbone";
import _ from "underscore";

import ChannelMessage from "./channel_message";

const ChannelModel = Backbone.Model.extend({});

const ChannelCollection = Backbone.Model.extend({
  model: ChannelModel,
  url: "/api/channels",
});

const ChannelListView = Backbone.View.extend({
  template: _.template($("script[id='template-channel-list']").html()),
  initialize(options) {
    this.collection = options.collection;

    _.bindAll(this, "render");

    this.collection.bind("reset", this.render);
    this.collection.bind("add", this.render);
    this.collection.bind("change", this.render);
    this.collection.bind("remove", this.render);
  },
  render() {
    this.$el.html(
      this.template({
        channels: this.collection.toJSON(),
      })
    );

    return this;
  },
});

const ChannelView = Backbone.View.extend({
  template: _.template($("script[id='template-channel']").html()),
  initialize(options) {
	  console.log(options)
	this.channel_id = options.channel_id;

    this.collection = new ChannelMessage.ChannelMessageCollection();
	this.collection.channel_id = this.channel_id;

    _.bindAll(this, "render");

    this.collection.bind("reset", this.render);
    this.collection.bind("add", this.render);
    this.collection.bind("change", this.render);
    this.collection.bind("remove", this.render);

	this.collection.fetch();
  },
  render() {
    this.$el.html(
      this.template({
        messages: this.collection.toJSON(),
      })
    );

    return this;
  },
});

export { ChannelModel, ChannelCollection, ChannelListView, ChannelView };

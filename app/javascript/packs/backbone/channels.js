import Backbone from "backbone";
import _ from "underscore";

const ChannelModel = Backbone.Model.extend({});

const ChannelCollection = Backbone.Model.extend({
  model: ChannelModel,
  url: "/api/channels",
});

const ChannelListView = Backbone.View.extend({
  el: "#app",
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

export { ChannelModel, ChannelCollection, ChannelListView };

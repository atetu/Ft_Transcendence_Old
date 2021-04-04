import Backbone from "backbone";
import _ from "underscore";

const ChannelMessageModel = Backbone.Model.extend({});

const ChannelMessageCollection = Backbone.Model.extend({
  model: ChannelMessageModel,
  url() {
    return `/api/channels/${this.channel_id}/messages`;
  }
});

export default {
  ChannelMessageModel,
  ChannelMessageCollection,
};

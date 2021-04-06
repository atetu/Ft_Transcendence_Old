import Backbone from "backbone";
import _ from "underscore";

const ChannelMessageModel = Backbone.Model.extend({
	urlRoot() {
		return `/api/channels/${this.get("channel_id")}/messages`
	}
});

const ChannelMessageCollection = Backbone.Collection.extend({
  model: ChannelMessageModel,
  url() {
    return `/api/channels/${this.channel_id}/messages`;
  }
});

export default {
  ChannelMessageModel,
  ChannelMessageCollection,
};

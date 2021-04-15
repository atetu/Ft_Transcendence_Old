import Backbone from "backbone";

const ChannelModel = Backbone.Model.extend({
  urlRoot: "/api/channels",
});

export default ChannelModel;

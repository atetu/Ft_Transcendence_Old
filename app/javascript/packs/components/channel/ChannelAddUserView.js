import Backbone from "backbone";
import _ from "underscore";

import ChannelModel from "./ChannelModel";

const ChannelAddUserView = Backbone.View.extend({
  template: _.template($("script[id='template-channel-add']").html()),
  initialize({ id }) {
    this.channel = new ChannelModel({ id });

    _.bindAll(this, "render");
  },
  render() {
    this.$el.html(
      this.template({
        channel: this.channel.toJSON(),
      })
    );

    this.$usernameSelect = this.$("#username-select").select2({
      ajax: {
        url: "/api/search/users",
		data: (params) => ({ query: params.term }),
        dataType: "json",
		processResults: (data) => ({ results: _.map(data.users, (x) => {
			x.text = x.username;
			return x;
		}) })
      },
	  placeholder: 'search a user',
	  minimumInputLength: 1,
    });

    return this;
  },
});

export default ChannelAddUserView;

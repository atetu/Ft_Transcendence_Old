import Backbone from "backbone";
import _ from "underscore";

import ChannelModel from "./ChannelModel";
import { ChannelUserModel } from "./user";

const ChannelBaseActionView = Backbone.View.extend({
  baseTemplate: _.template(
    $("script[id='template-channel-base-action']").html()
  ),
  initialize(options) {
	const { id, userId, fetch } = options;

    this.channel = new ChannelModel({ id });
    this.user = new ChannelUserModel({ id: userId, channel: this.channel });

    this.state = new (Backbone.Model.extend({}))({
      loading: false,
      error: null
    });

    _.bindAll(this, "render", "fetch", "onYes", "updateUserAttributes");
	
    this.channel.bind("change:members", this.updateUserAttributes);

    this.state.bind("change", this.render);
    this.channel.bind("change", this.render);

    if (fetch) {
      this.fetch();
    }

	this.impl = null;
  },
  fetch() {
    this.state.set({ loading: true });

    return this.channel
      .fetch()
      .then(() => this.state.set({ loading: false }))
      .catch((error) => this.state.set({ loading: false, error }));
  },
  render() {
    const data = {
      channel: this.channel.toJSON(),
      state: this.state.toJSON(),
    };

    this.$el.html(this.baseTemplate(data));

    this.$yesButton = this.$("#yes-button");
    this.$backButton = this.$("#back-button");

	this.$yesButton.on("click", this.onYes);
    this.$backButton.attr("href", `#channel/${this.channel.id}`);

    this.$2 = this.$("#impl-container");
    if (this.$2 && this.impl) {
		this.impl.render2(this.$2, data);
    }

    return this;
  },
  onYes() {
    /* no operation */
  },
  updateUserAttributes() {
	const members = Object.values(this.channel.get("members") || {});
	const member = members.filter((x) => x.user.id == this.user.id)[0];

	console.log(member)

	if (member) {
		this.user.set(member);
	}
	
	console.log(this.user)
  },
  notifyImpl(instance) {
	  this.impl = instance;
  }
});

export default ChannelBaseActionView;

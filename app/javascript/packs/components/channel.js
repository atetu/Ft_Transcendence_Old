import Backbone from "backbone";
import _ from "underscore";
import consumer from "../../channels/consumer";

import ChannelMessage from "./channel_message";

const ChannelModel = Backbone.Model.extend({
  urlRoot: "/api/channels",
  default: {
    $loading: false,
    $error: null,
    $connected: false,
    $subscriber: null,
  },
});

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
  events: {
    "click #send-button": "submit",
  },
  initialize(options) {
    this.channel = new ChannelModel({ id: options.channel_id });

    this.collection = new ChannelMessage.ChannelMessageCollection();
    this.collection.channel_id = this.channel.id;

    _.bindAll(this, "render", "connect", "scrollToBottom");

    this.channel.on("change", this.render);
    this.collection.bind("reset", this.render);
    this.collection.bind("add", this.render);
    this.collection.bind("change", this.render);
    this.collection.bind("remove", this.render);

    this.collection.bind("add", this.scrollToBottom);

    this.fetch().then(this.connect);
  },
  render() {
    this.$el.html(
      this.template({
        error: this.channel.get("$error"),
        loading: this.channel.get("$loading"),
        connected: this.channel.get("$connected"),
        channel: this.channel.toJSON(),
        messages: this.collection.toJSON(),
      })
    );

    this.delegateEvents();

    return this;
  },
  fetch() {
    if (this.channel.get("$loading")) {
      return;
    }

    this.channel.set("$loading", true);

    return this.channel
      .fetch()
      .then(() => this.collection.fetch())
      .catch((error) => this.channel.set("$error", error))
      .then(() => this.channel.set("$loading", false));
  },
  connect() {
    const self = this;

    this.channel.set(
      "$subscriber",
      consumer.subscriptions.create(
        {
          channel: "ChannelChannel",
          channel_id: self.channel.id,
        },
        {
          connected(x) {
            console.log("connected(): " + x);
            self.channel.set("$connected", true);
          },
          disconnected(x) {
            console.log("disconnected(): " + x);
            self.channel.set("$connected", false);
          },
          received(data) {
            console.log("received(" + JSON.stringify(data) + ")");
            self.collection.add(data);
          },
        }
      )
    );
  },
  disconnect() {
    consumer.subscriptions.remove(this.channel.get("$subscriber"));
  },
  submit() {
    const message = this.$("#message-input").val();

    if (!message) {
      return;
    }

    this.$("#message-input").val("");

    new ChannelMessage.ChannelMessageModel().save({
      channel_id: this.channel.id,
      content_type: "text",
      content: message,
    });
  },
  scrollToBottom() {
    const div = this.$("#message-container");

    if (div[0]) {
      div.scrollTop(div[0].scrollHeight);
    }
  },
  onClose() {
    this.disconnect();
  },
});

const ChannelCreateOrEditView = Backbone.View.extend({
  template: _.template($("script[id='template-channel-create']").html()),
  events: {
    "change #visibility-select": "visibilityChange",
    "click #submit-button": "submit",
  },
  initialize(options) {
    this.channel = new ChannelModel({ id: options?.channel_id });

    _.bindAll(this, "render");

    if (this.channel.id) {
      this.channel.on("change", this.render);
      this.channel.fetch();
    }
  },
  render() {
    this.$el.html(
      this.template({
        name: this.channel.get("name") || "",
        visibility: this.channel.get("visibility") || "public",
      })
    );

    this.$nameInput = this.$("#name-input");
    this.$visibilitySelect = this.$("#visibility-select");
    this.$passwordFormGroup = this.$("#password-form-group");
    this.$passwordInput = this.$("#password-input");

    return this;
  },
  visibilityChange() {
    if (this.$visibilitySelect.val() == "protected") {
      this.$passwordFormGroup.show();
    } else {
      this.$passwordFormGroup.hide();
    }
  },
  submit() {
    const props = {
      name: this.$nameInput.val(),
      visibility: this.$visibilitySelect.val(),
    };

    const password = this.$passwordInput.val();
    if (password && props.visibility == "protected") {
      Object.assign(props, { password });
    }

	this.channel.save(props).then(() => {
		window.location.hash = `#channel/${this.channel.id}`;
	});
  },
});

export {
  ChannelModel,
  ChannelCollection,
  ChannelListView,
  ChannelView,
  ChannelCreateOrEditView,
};

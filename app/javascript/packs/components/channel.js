import Backbone from "backbone";
import _ from "underscore";
import consumer from "../../channels/consumer";

import ChannelMessage from "./channel_message";

const ChannelModel = Backbone.Model.extend({
  urlRoot: "/api/channels",
  default: {
    loading: false,
    error: null,
    connected: false,
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
    "click #error-refresh": "refresh",
    "click #send-button": "submit",
    "keyup #message-input": "keyup",
  },
  initialize(options) {
    this.channel = new ChannelModel({ id: options.channel_id });
    this.state = new (Backbone.Model.extend({
      default: {
        loading: false,
        error: null,
        connected: false,
        $subscriber: null,
      },
    }))();

    this.collection = new ChannelMessage.ChannelMessageCollection();
    this.collection.channel_id = this.channel.id;

    _.bindAll(this, "render", "connect", "scrollToBottom");

    this.channel.on("change", this.render);
    this.state.on("change", this.render);

    this.collection.bind("reset", this.render);
    this.collection.bind("add", this.render);
    this.collection.bind("change", this.render);
    this.collection.bind("remove", this.render);

    this.collection.bind("add", this.scrollToBottom);

    this.refresh();
  },
  render() {
	const previousFocusId = document.activeElement?.id;

    this.$el.html(
      this.template({
        state: this.state.toJSON(),
        channel: this.channel.toJSON(),
        messages: this.collection.toJSON(),
      })
    );

	if (previousFocusId) {
		this.$(`#${previousFocusId}`).focus();
	}

    this.$messageInput = this.$("#message-input");
    this.$messageContainer = this.$("#message-container");

    this.delegateEvents();
    this.scrollToBottom();

    return this;
  },
  fetch() {
    if (this.state.get("loading")) {
      return;
    }

    this.state.set("loading", true);

    return this.channel
      .fetch()
      .then(() => this.collection.fetch())
      .catch((error) => this.state.set("error", error))
      .then(() => this.state.set("loading", false));
  },
  refresh() {
    this.state.set("error", null);

    this.disconnect();

    this.fetch().then(this.connect);
  },
  connect() {
    if (this.state.get("error")) {
      return;
    }

    const self = this;

    self.state.set("rejected", false);

    this.state.set(
      "subscriber",
      consumer.subscriptions.create(
        {
          channel: "ChannelChannel",
          channel_id: self.channel.id,
        },
        {
          connected(x) {
            console.log("connected(): " + x);
            self.state.set("connected", true);
          },
          rejected(x) {
            self.state.set("rejected", true);
            console.log("rejected(): " + x);
          },
          disconnected(x) {
            console.log("disconnected(): " + x);
            self.state.set("connected", false);
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
    if (this.state.get("connected")) {
      consumer.subscriptions.remove(this.state.get("subscriber"));
    }
  },
  keyup(event) {
    if (event.keyCode == 13 /* enter */) {
      this.submit();
    }
  },
  submit() {
    const message = this.$messageInput.val();

    if (!message) {
      return;
    }

    this.$messageInput.val("");

    new ChannelMessage.ChannelMessageModel().save({
      channel_id: this.channel.id,
      content_type: "text",
      content: message,
    });
  },
  scrollToBottom() {
    const div = this.$messageContainer;

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

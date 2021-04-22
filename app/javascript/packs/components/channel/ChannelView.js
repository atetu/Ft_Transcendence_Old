import Backbone from "backbone";
import _ from "underscore";
import consumer from "../../../channels/consumer";

import ChannelModel from "./ChannelModel";

import { ChannelMessageModel, ChannelMessageCollection } from "./message";
import { ChannelUserCollection } from "./user";

const LoadingView = Backbone.View.extend({
  template: _.template($("script[id='template-channel-loading']").html()),
  render() {
    this.$el.html(this.template());

    return this;
  },
});

const ErrorView = Backbone.View.extend({
  template: _.template($("script[id='template-channel-error']").html()),
  initialize({ status, message, refresh }) {
    this.status = status;
    this.message = message;
    this.refresh = refresh;
  },
  events: {
    "click #refresh"() {
      this.refresh();
    },
  },
  render() {
    this.$el.html(
      this.template({
        status: this.status,
        message: this.message,
      })
    );

    return this;
  },
});

const PasswordProtectedView = Backbone.View.extend({
  template: _.template(
    $("script[id='template-channel-password-protected']").html()
  ),
  initialize({ channel, refresh }) {
    this.channel = channel;
    this.refresh = refresh;

    this.state = new (Backbone.Model.extend())({
      error: null,
      loading: false,
    });

    this.submitRequest = new (Backbone.Model.extend({
      urlRoot() {
        return `/api/channels/${channel.id}/join`;
      },
      default: {
        password: null,
      },
    }))();

    _.bindAll(this, "render", "disableAll", "enableAll", "toggleDisable");

    this.state.on("change", this.render);
  },
  render() {
    this.$el.html(this.template(this.state.toJSON()));

    this.$passwordInput = this.$("#password-input");
    this.$submitButton = this.$("#submit-button");
    this.$refreshLink = this.$("#refresh");

    this.toggleDisable();

    return this;
  },
  submit() {
    if (this.state.get("loading")) {
      return;
    }

    const password = this.$passwordInput.val();

    this.disableAll();

    this.state.set({
      loading: true,
      error: null,
    });

    this.submitRequest
      .save({
        password,
      })
      .then(
        this.refresh
      ) /* no need to set loading to false, we are leaving the page */
      .catch((error) =>
        this.state.set({
          loading: false,
          error: error,
        })
      );
  },
  events: {
    "click #refresh"() {
      this.refresh();
    },
    "keyup #password-input"(event) {
      if (event.keyCode == 13 /* enter */) {
        this.submit();
      }
    },
    "click #submit-button": "submit",
  },
  disableAll() {
    this.$passwordInput.disable();
    this.$submitButton.disable();
    this.$refreshLink.disable();
  },
  enableAll() {
    this.$passwordInput.enable();
    this.$submitButton.enable();
    this.$refreshLink.enable();
  },
  toggleDisable() {
    if (this.state.get("loading")) {
      this.disableAll();
    } else {
      this.enableAll();
    }
  },
});

const PrivateView = Backbone.View.extend({
  template: _.template($("script[id='template-channel-private']").html()),
  initialize({ channel, refresh }) {
    this.channel = channel;
    this.refresh = refresh;

    _.bindAll(this, "render");
  },
  render() {
    this.$el.html(this.template());

    return this;
  },
  events: {
    "click #refresh"() {
      this.refresh();
    },
  },
});

const MessageView = Backbone.View.extend({
  template: _.template($("script[id='template-channel-message']").html()),
  initialize({ model }) {
    this.model = model;

    _.bindAll(this, "render");

    this.model.on("change", this.render);
  },
  render() {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },
  events: {
    "click .channel-message"() {
      console.log("TODO: Display profile in modal");
    },
  },
});

const MessageListView = Backbone.View.extend({
  template: _.template($("script[id='template-channel-message-list']").html()),
  initialize({ collection }) {
    this.collection = collection;

    _.bindAll(this, "render", "addOne", "addOneAndScroll");

    this.collection.bind("reset", this.render);
    this.collection.bind("add", this.addOneAndScroll);
    this.collection.bind("change", this.render);
    this.collection.bind("remove", this.render);
  },
  render() {
    this.$el.html(this.template());

    this.$container = this.$("#message-container");

    this.addAll();

    return this;
  },
  addOneAndScroll(model) {
    this.addOne(model);
    this.scrollToBottom();
  },
  addAll() {
    this.collection.each(this.addOne);
    this.scrollToBottom();
  },
  addOne(model) {
    this.$container.append(
      new MessageView({
        model,
      }).render().$el
    );
  },
  scrollToBottom() {
    const div = this.$container;

    if (div[0]) {
      div.scrollTop(div[0].scrollHeight);
    }
  },
});

const MemberView = Backbone.View.extend({
  template: _.template($("script[id='template-channel-member']").html()),
  initialize({ channel, model }) {
    this.channel = channel;
    this.model = model;

    _.bindAll(this, "render");

    this.model.on("change", this.render);
  },
  render() {
    this.$el.html(
      this.template({
        member: this.model.toJSON(),
        channelOwner: this.channel.get("owner"),
      })
    );

    return this;
  },
  events: {
    "click .channel-member"() {
      console.log("TODO: Display profile in modal");
    },
  },
});

const MemberListView = Backbone.View.extend({
  initialize({ channel, collection }) {
    this.channel = channel;
    this.collection = collection;

    _.bindAll(this, "render", "addOne");

    this.collection.bind("reset", this.render);
    this.collection.bind("add", this.addOne);
    this.collection.bind("change", this.render);
    this.collection.bind("remove", this.render);
  },
  render() {
    this.$el.empty();
    this.addAll();

    return this;
  },
  addAll() {
    this.collection.each(this.addOne);
  },
  addOne(model) {
    this.$el.append(
      new MemberView({
        channel: this.channel,
        model,
      }).render().el
    );
  },
});

const ChannelView = Backbone.View.extend({
  template: _.template($("script[id='template-channel']").html()),
  events: {
    "click #error-refresh": "refresh",
    "click #send-button": "submit",
    "keyup #message-input": "keyup",
    "click #leave-link": "askLeave",
  },
  initialize({ id }) {
    this.channel = new ChannelModel({ id });
    this.members = new ChannelUserCollection([], { channel: this.channel });
    this.messages = new ChannelMessageCollection([], { channel: this.channel });

    this.state = new (Backbone.Model.extend({
      default: {
        loading: false,
        error: null,
        connected: false,
        $subscriber: null,
      },
    }))();

    _.bindAll(this, "render", "connect", "refresh");

    this.state.on("change", this.render);
    this.channel.on("change", this.render);

    this.refresh();
  },
  render() {
    this.$el.empty();

    if (this.state.get("loading")) {
      this.$el.append(new LoadingView().render().$el);
    } else if (this.state.get("error")) {
      const error = this.state.get("error");
      const message = error.responseJSON?.message;

      if (message === "password protected") {
        this.$el.append(
          new PasswordProtectedView({
            channel: this.channel,
            refresh: this.refresh,
          }).render().$el
        );
      } else if (message === "private") {
        this.$el.append(
          new PrivateView({
            channel: this.channel,
            refresh: this.refresh,
          }).render().$el
        );
      } else {
        this.$el.append(
          new ErrorView({
            status: error.status,
            message: error.responseJSON?.message,
            refresh: this.refresh,
          }).render().$el
        );
      }
    } else {
      this.$el.html(
        this.template({
          state: this.state.toJSON(),
          channel: this.channel.toJSON(),
        })
      );

      new MessageListView({
        el: this.$("#messages-part"),
        collection: this.messages,
      }).render();

      new MemberListView({
        el: this.$("#members-part"),
        channel: this.channel,
        collection: this.members,
      }).render();

      this.$messageInput = this.$("#message-input");
      this.$messageContainer = this.$("#message-container");
    }

    return this;
  },
  fetch() {
    if (this.state.get("loading")) {
      return;
    }

    this.state.set("loading", true);

    return this.channel
      .fetch()
      .then(() => this.messages.fetch())
      .catch((error) => this.state.set("error", error))
      .then(() => this.state.set("loading", false));
  },
  refresh() {
    console.log("refreshing");

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
            self.messages.add(data);
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

    new ChannelMessageModel({
      channel: this.channel,
    }).save({
      content_type: "text",
      content: message,
    });
  },
  askLeave() {
    if (confirm("are you sure")) {
      const self = this;

      new (Backbone.Model.extend({
        urlRoot() {
          return `/api/channels/${self.channel.id}/leave`;
        },
        default: {
          password: null,
        },
      }))().save()
	  .then(() => window.location.hash = `#channels`)
	  .catch((error) => alert(error.responseJSON?.message || `error: ${error.status}`));
    }
  },
  onClose() {
    this.disconnect();
  },
});
console.log(_.templateSettings);

export default ChannelView;

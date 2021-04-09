import Backbone from "backbone";
import _ from "underscore";

const UserModel = Backbone.Model.extend({
  urlRoot: "/api/users",
  default: {
    $loading: false,
    $error: null,
  },
});

const UserCollection = Backbone.Collection.extend({
  url: "/api/users",
});

const UserListView = Backbone.View.extend({
  template: _.template($("script[id='template-user-list']").html()),
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
        users: this.collection.toJSON(),
      })
    );

    return this;
  },
});

const UserProfileView = Backbone.View.extend({
  template: _.template($("script[id='template-user-profile']").html()),
  events: {},
  initialize(options) {
    this.user = new UserModel({ id: options.user_id });

    _.bindAll(this, "render");

    this.user.on("change", this.render);

    this.fetch();
  },
  render() {
    this.$el.html(
      this.template({
        error: this.user.get("$error"),
        loading: this.user.get("$loading"),
        user: this.user.toJSON(),
      })
    );

	this.$('[data-toggle="tooltip"]').tooltip();

    return this;
  },
  fetch() {
    if (this.user.get("$loading")) {
      return;
    }

    this.user.set("$loading", true);

    return this.user
      .fetch()
      .catch((error) => this.user.set("$error", error))
      .then(() => this.user.set("$loading", false));
  },
});

export { UserModel, UserCollection, UserListView, UserProfileView };

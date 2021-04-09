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
        isSelf: user_signed_in && this.user.id === current_user.id,
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

const UserProfileEditView = Backbone.View.extend({
  template: _.template($("script[id='template-user-profile-edit']").html()),
  events: {
    "click #upload-button": "upload",
    "change #file-input": "changeInput",
  },
  initialize(options) {
    _.bindAll(this, "render");
  },
  render() {
    this.$el.html(this.template({}));

    this.$usernameInput = this.$("#username-input");
    this.$previewImage = this.$("#preview-image");
    this.$fileInput = this.$("#file-input");

    if (user_signed_in /* must be always true */) {
      this.$usernameInput.val(current_user.username);
      this.$previewImage.attr("src", current_user.picture);
    }

    return this;
  },
  upload() {
    console.log("x");
  },
  changeInput(event) {
    var input = this.$fileInput[0];

    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.$previewImage.attr("src", e.target.result).fadeIn("slow");
      };
      reader.readAsDataURL(input.files[0]);
    }
  },
});

export {
  UserModel,
  UserCollection,
  UserListView,
  UserProfileView,
  UserProfileEditView,
};

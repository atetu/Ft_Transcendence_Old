import Backbone from "backbone";
import _ from "underscore";

import ChannelModel from "./ChannelModel";

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

export default ChannelCreateOrEditView;

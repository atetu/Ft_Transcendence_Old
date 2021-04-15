import Backbone from "backbone";
import _ from "underscore";

import ChannelModel from "./ChannelModel";

const ChannelCreateOrEditView = Backbone.View.extend({
  template: _.template($("script[id='template-channel-create']").html()),
  events: {
    "change #visibility-select": "visibilityChange",
    "click #submit-button": "submit",
  },
  initialize({ id }) {
    this.channel = new ChannelModel({ id });

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

    this.visibilityChange();

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

    new ChannelModel({ id: this.channel.id }).save(props).then(() => {
      window.location.hash = `#channel/${this.channel.id}`;
    }).catch((error) => {
		switch (error.status) {
			case 406: {
				const fields = error.responseJSON.fields;


				const selectors = {
					form: "#channel-form",
					fields: {
						name: "#name-invalid",
						visibility: "#visibility-invalid",
						password: "#password-invalid",
					}
				}

				for (const selector in Object.values(selectors.fields)) {
					this.$(selector).text("");
					this.$(selector).hide();
				}

				for (const field in fields) {
					const validations = fields[field];
					const selector = selectors.fields[field];

					this.$(selector).show();
					this.$(selector).text(validations.join(", "));
				}
				
				//this.$(selectors.form).addClass('was-validated');

				break;
			}
		}
	});
  },
});

export default ChannelCreateOrEditView;

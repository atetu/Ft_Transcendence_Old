import jquery from "jquery";

jquery.fn.extend({
  disable() {
    return this.prop("disabled", true);
  },
  enable() {
    return this.removeAttr("disabled");
  },
});

import "@mdi/font/css/materialdesignicons";

require("@rails/ujs").start();
require("@rails/activestorage").start();
require("channels");
require("jquery-ui");
require("bootstrap");

import Router from "./router";

window.$ = require("jquery");
window._ = require("underscore");
window.Backbone = require("backbone");

Backbone.View.prototype.close = function () {
  this.remove();
  this.unbind();
  if (this.onClose) {
    this.onClose();
  }
};

var AppModel = Backbone.Model.extend({});

var AppView = Backbone.View.extend({
  el: "#app",
  initialize(options) {
    this.model.on("change:view", this.render, this);
  },
  render() {
    let view = this.model.get("view");

    if (view) {
      this.$el.html(view.render().el);
    }
  },
});

const app = {
  setView(view) {
	this.model.get("view")?.close();
    this.model.set("view", view);
  },
  start() {
    this.router = new Router({ app: this });
    console.log(this.router);

    this.model = new AppModel({ view: null });
    this.view = new AppView({ model: this.model });
    this.view.render();

    Backbone.history.start();
  },
};

export default app;

$(document).ready(function () {
  app.start();
});

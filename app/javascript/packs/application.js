// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start();
require("turbolinks").start();
require("@rails/activestorage").start();
require("channels");
require("jquery-ui");
require("bootstrap");

window.$ = require("jquery");
window._ = require("underscore");
window.Backbone = require("backbone");

document.addEventListener("turbolinks:load", () => {
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();
});

$(function() {
	window.router = require("./router");
	window.channels = require("./backbone/channels");

	Backbone.history.start();
	Backbone.history.loadUrl(Backbone.history.fragment);

	var channelCollection = new channels.ChannelCollection();

	var channelList = new channels.ChannelListView({
		collection: channelCollection
	});

	channelCollection.fetch();
})
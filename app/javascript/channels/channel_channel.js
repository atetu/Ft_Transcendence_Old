import consumer from "./consumer"

consumer.subscriptions.create("ChannelChannel", {
  connected(x) {
	  console.log("connected(): " + x);
    // Called when the subscription is ready for use on the server
  },

  disconnected(x) {
	console.log("disconnected(): " + x);
    // Called when the subscription has been terminated by the server
  },

  received(data) {
	console.log("received(" + data + ")");
    // Called when there's incoming data on the websocket for this channel
  }
});

// import Backbone from "backbone";
import consumer from "./consumer"

// consumer.subscriptions.create({ channel: "GameChannel" })
consumer.subscriptions.create({
    channel: "GameChannel",
    game_id: 1234,       // exemple
    side: "left"         // exemple
}, {
    connected() {
        console.log("connected!");
    },
    received() {
        // switch (data.type) {
        //     case "move": {
        //         break;
        //     }
		// }
		var canvas = document.getElementById('tutorial');
		if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = "#00ff00";
		ctx.fillRect(5, 5, 10, 50);
		}
    },
    disconnected() {
        console.log("disconnected!");
    }
});

// const ChannelModel = Backbone.Model.extend({
// 	urlRoot: "/api/channels",
// 	default: {
// 	  $loading: false,
// 	  $error: null,
// 	  $connected: false,
// 	  $subscriber: null,
// 	},
//   });
  
//   const ChannelCollection = Backbone.Model.extend({
// 	model: ChannelModel,
// 	url: "/api/channels",
//   });

//   const ChannelView = Backbone.View.extend({
// 	events: {
// 	  "click #send-button": "submit",
// 	},
// 	initialize(options) {
// 	  this.channel = new ChannelModel({ id: options.channel_id });
  
// 	  this.collection = new ChannelMessage.ChannelMessageCollection();
// 	  this.collection.channel_id = this.channel.id;
  
// 	  _.bindAll(this, "render", "connect", "scrollToBottom");
  
// 	  this.channel.on("change", this.render);
// 	  this.collection.bind("reset", this.render);
// 	  this.collection.bind("add", this.render);
// 	  this.collection.bind("change", this.render);
// 	  this.collection.bind("remove", this.render);
  
// 	  this.collection.bind("add", this.scrollToBottom);
  
// 	  this.fetch().then(this.connect);
// 	},
// 	render() {
// 	  this.$el.html(
// 		this.template({
// 		  error: this.channel.get("$error"),
// 		  loading: this.channel.get("$loading"),
// 		  connected: this.channel.get("$connected"),
// 		  channel: this.channel.toJSON(),
// 		  messages: this.collection.toJSON(),
// 		})
// 	  );
  
// 	  this.delegateEvents();
  
// 	  return this;
// 	},
// 	fetch() {
// 		if (this.channel.get("$loading")) {
// 			return;
// 		  }
	  
// 		  this.channel.set("$loading", true);
	  
// 		  return this.channel
// 			.fetch()
// 			.then(() => this.collection.fetch())
// 			.catch((error) => this.channel.set("$error", error))
// 			.then(() => this.channel.set("$loading", false));
// 		},



// 	connect: function () {
// 		const self = this;

// 		this.channel.set(
// 			"$subscriber",
// 			consumer.subscriptions.create(
// 				{
// 					channel: "GameChannel",
// 					game_id: self.game.id,
// 				},
// 				{
// 					connected(x) {
// 						console.log("connected(): " + x);
// 						// self.game.set("$connected", true);
// 					},
// 					disconnected(x) {
// 						"";
// 						console.log("disconnected(): " + x);
// 						// self.channel.set("$connected", false);
// 					},
// 					received(data) {
// 						switch (data.type) {
// 							case "move": {
// 								break;
// 							}
// 						}
// 						// console.log("received(" + JSON.stringify(data) + ")");
// 						// console.log(self.collection);
// 						// console.log(self);
// 						// self.collection.add(data);
// 						// resetCanvas();
// 					}
// 				}
// 			)
// 		)
// 	}
// }
// )

// 	draw: function () {
// 		var canvas = document.getElementById('tutorial');
// 		if (canvas.getContext) {
// 			var ctx = canvas.getContext('2d');
// 		}
// 		resetCanvas()
// 		{
// 			this.ctx.clearRect(0, 0, 100, 50);
// 			this.ctx.fillStyle = this.background_color;
// 			this.ctx.fillRect(0, 0, 100, 50);
// 		}
// 		let y = 0;
// 		let ballX = 0, ballY = 0;
// 		let enemyPaddleY = 0;
// 		let mySide = 0;

// 		var socket = new WebSocket('ws://127.0.0.1:7000/');
// 		socket.onmessage = ((event) => {
// 			const msg = JSON.parse(event.data);

// 			switch (msg.type) {
// 				case "side": {
// 					mySide = msg.side;
// 					break;
// 				}

// 				case "ball-pos": {
// 					ballX = msg.ballX;
// 					ballY = msg.ballY;
// 					break;
// 				}

// 				case "pos": {
// 					if (msg.self) {
// 						y = msg.y;
// 					} else {
// 						enemyPaddleY = msg.y;
// 					}
// 					break;
// 				}
// 			}

// 		});

// 		document.addEventListener("keydown", (event) => {
// 			switch (event.keyCode) {

// 				case 38: {
// 					y -= 5;
// 					break;
// 				}

// 				case 40: {
// 					y += 5;
// 					break;
// 				}
// 			}

// 			socket.send(JSON.stringify({
// 				type: "move",
// 				y
// 			}))
// 		})

// 		setInterval(() => {
// 			ctx.clearRect(0, 0, canvas.width, canvas.height);

// 			ctx.fillStyle = "#ff0000";
// 			ctx.fillRect(ballX, ballY, 10, 10);


// 			if (mySide) /* left */ {
// 				ctx.fillStyle = "#00ff00";
// 				ctx.fillRect(5, y, 10, 50);

// 				ctx.fillStyle = "#0000ff";
// 				ctx.fillRect(canvas.width - 10 - 5, enemyPaddleY, 10, 50);
// 			} else {
// 				ctx.fillStyle = "#00ff00";
// 				ctx.fillRect(canvas.width - 10 - 5, y, 10, 50);

// 				ctx.fillStyle = "#0000ff";
// 				ctx.fillRect(5, enemyPaddleY, 10, 50);
// 			}
// 		}, 1000 / 10);
// 	}
// }
// )


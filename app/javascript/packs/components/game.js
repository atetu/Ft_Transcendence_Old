import Backbone from "backbone";
import _ from "underscore";
import consumer from "../../channels/consumer"

console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
var y = null;
const GameModel = Backbone.Model.extend({
    urlRoot: "/api/games",
    default: {
        $loading: false,
        $error: null,
        $connected: false,
        $subscriber: null,
    },
});

const GameCollection = Backbone.Model.extend({
    model: GameModel,
    url: "/api/games",
});

// paddleMove() {
    // document.addEventListener("keydown", (event) => {
    //     console.log(self.game.y);
    //     switch (event.keyCode) {

    //         case 38: {
    //             self.game.y -= 5;
    //             break;
    //         }

    //         case 40: {
    //             self.game.y += 5;
    //             break;
    //         }
    //     }
    // });
// };

const GameView = Backbone.View.extend({
    template: _.template($("script[id='template-game']").html()),
    initialize(options) {
        this.game = new GameModel({ id: options?.game_id });
       
        // this.y = 5;
        // this.ballX = 100;
        // this.ballY = 50;

        _.bindAll(this, "render", "connect");

        this.game.on("change", this.render);
    
       this.render();
        this.connect();
        // this.fetch().then(this.connect);
    },
    render() {
        this.$el.html(
            this.template({
                 })
        );
        this.delegateEvents();
    

        return this;
    },
    connect() {
        const self = this;
        var sub = null
        self.my_paddle = 0
        self.enemy_paddle = 0
        self.ball_x = 0
        self.ball_y = 0
        self.my_side = 0
        console.log("***********************");
        this.game.set(
            "$subscriber",
            sub = consumer.subscriptions.create(
                {
                    channel: "GameChannel",
                    game_id: self.game.id,       // exemple
                    // side: self.game.side,         // exemple
                    // ball_x: self.game.ball_x,
                    // ball_y: self.game.ball_y,
                    // y: self.game.y
                },
                {
                    connected() {
                        console.log("connected(): ")
                        console.log(self.ball_x)
                        // document.addEventListener("keydown", (event) => {
                        //     var input;
                        //     switch (event.keyCode) {

                        //         case 38: {
                        //             // my_paddle -= 1;
                        //             input = -1
				        //             this.perform('input', input)
                        //             break;
                        //         }

                        //         case 40: {
                        //             // my_paddle += 1;
                        //             input = 1
				        //             this.perform('input', input)
                        //             break;
                        //         }
                        //     }
                        // });
                        // setInterval(() => {
                        //      var canvas = document.getElementById('myCanvas')
                        // var ctx = canvas.getContext('2d')
                        //     ctx.clearRect(0, 0, canvas.width, canvas.height)
                        //     ctx.fillStyle = 'black';
                        //     ctx.fillRect(0, 0, canvas.width, canvas.height)
                            
                        //     if (self.my_side)
                        //     {
                        //         ctx.fillStyle = 'blue'
                        //         ctx.fillRect(canvas.width - 15, self.my_paddle, 10, 50);
                        //         ctx.fillStyle = 'red'
                        //         ctx.fillRect(5, self.enemy_paddle, 10, 50);
                        //     }
                        //     else
                        //     {
                        //         ctx.fillStyle = 'blue'
                        //         ctx.fillRect(5, self.my_paddle, 10, 50);
                        //         ctx.fillStyle = 'red'
                        //         ctx.fillRect(canvas.width - 5, self.enemy_paddle, 10, 50);
                        //     }
                        //     ctx.fillStyle = 'blue'
                        //     ctx.arc(self.ball_x, self.ball_y, 5, 2 * Math.PI, false);
                        //     ctx.stroke
       
                        // }, 1000 / 10);
                        // var canvas = document.getElementById('myCanvas')
                        // var ctx = canvas.getContext('2d')
                    //    ctx.fillStyle = "#0000ff";
                        // document.addEventListener("keydown", (event) => {
                        //     console.log(self.ball_x);
                        //     switch (event.keyCode) {

                        //         case 38: {
                        //             self.y -= 1;
                        //             break;
                        //         }

                        //         case 40: {
                        //             self.y += 1;
                        //             break;
                        //         }
                        //     }
                        // });
                       
                        // setInterval(() => {
                        //     ctx.clearRect(0, 0, canvas.width, canvas.height);
                        //     ctx.fillStyle = 'black';
                        //     ctx.fillRect(0, 0, canvas.width, canvas.height);
                            
                        //     if (my_side)
                        //     {
                        //         ctx.fillStyle = 'blue';
                        //         ctx.fillRect(canvas.width - 15, my_paddle, 10, 50);
                        //         ctx.fillStyle = 'red';
                        //         ctx.fillRect(5, enemy_paddle, 10, 50);
                        //     }
                        //     else
                        //     {
                        //         ctx.fillStyle = 'blue';
                        //         ctx.fillRect(5, my_paddle, 10, 50);
                        //         ctx.fillStyle = 'red';
                        //         ctx.fillRect(canvas.width - 5, enemy_paddle, 10, 50);
                        //     }
                        //     ctx.fillStyle = 'white';
                        //     ctx.arc(self.ball_x, self.ball_y, 5, 2 * Math.PI, false);
                        //     ctx.stroke
            
            
                        //     // if (mySide) /* left */ {
                        //     //     ctx.fillStyle = "#00ff00";
                        //     //     ctx.fillRect(5, y, 10, 50);
            
                        //     //     ctx.fillStyle = "#0000ff";
                        //     //     ctx.fillRect(canvas.width - 10 - 5, enemyPaddleY, 10, 50);
                        //     // } else {
                        //     //     ctx.fillStyle = "#00ff00";
                        //     //     ctx.fillRect(canvas.width - 10 - 5, y, 10, 50);
            
                        //     //     ctx.fillStyle = "#0000ff";
                        //     //     ctx.fillRect(5, enemyPaddleY, 10, 50);
                        //     // }
                        // }, 1000 / 10);
                       
                        
                    },
                    disconnected() {
                        console.log("disconnected(): ");

                    },
                    received(data) {
                        console.log("received)");
                        var canvas = document.getElementById('myCanvas')
                        var ctx = canvas.getContext('2d')
                        self.ball_x = data.ball_x
                        self.ball_y = data.ball_y
                        self.player1 = data.player1
                        self.player2 = data.player2
                                               
                        self.my_side
                        self.my_paddle = 0
                        self.enemy_paddle
                   

                        if (self.player1 == current_user.id)
                            self.my_side = 0
                        else
                            self.my_side = 1
                        console.log("side: " + self.my_side)
                        if (self.my_side)
                        {
                            self.my_paddle = data.paddle2
                            self.enemy_paddle = data.paddle1
                        }
                        else
                        {
                            self.my_paddle = self.data.paddle1
                            self.enemy_paddle = self.data.paddle2
                        }
                        console.log("my paddle: " + self.my_paddle)
                        document.addEventListener("keydown", (event) => {
                            var input;
                            switch (event.keyCode) {

                                case 38: {
                                    console.log("GO UP")
                                    input = {side: self.my_side, movement: "up"}
				                    sub.perform('input', input)
                                    break;
                                }

                                case 40: {
                                    console.log("GO DOWN")
                                    input = {side: self.my_side, movement: "down"}
				                    sub.perform('input', input)
                                    break;
                                }
                            }
                        });

                        setInterval(() => {
                            ctx.clearRect(0, 0, canvas.width, canvas.height)
                            ctx.fillStyle = 'black';
                            ctx.fillRect(0, 0, canvas.width, canvas.height)
                            
                            if (self.my_side)
                            {
                                ctx.fillStyle = 'blue'
                                ctx.fillRect(canvas.width - 15, self.my_paddle, 10, 50);
                                ctx.fillStyle = 'red'
                                ctx.fillRect(5, self.enemy_paddle, 10, 50);
                            }
                            else
                            {
                                ctx.fillStyle = 'blue'
                                ctx.fillRect(5, self.my_paddle, 10, 50);
                                ctx.fillStyle = 'red'
                                ctx.fillRect(canvas.width - 5, self.enemy_paddle, 10, 50);
                            }
                            ctx.fillStyle = 'blue'
                            ctx.arc(self.ball_x, self.ball_y, 5, 2 * Math.PI, false);
                            ctx.stroke
       
                        }, 1000 / 10);
                    },
                }
            )
        )
    },
    disconnect() {
        consumer.subscriptions.remove(this.game.get("$subscriber"));
    },
});

export{
    GameView
  };
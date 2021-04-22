import Backbone from "backbone";
import _ from "underscore";
import consumer from "../../channels/consumer"
import Ma

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
                       
                        
                    },
                    disconnected() {
                        console.log("disconnected(): ");

                    },
                    received(data) {
                        console.log("received)");
                        var canvas = document.getElementById('myCanvas')
                        canvas.width = 600
                        canvas.height = 400
                    
                        var ctx = canvas.getContext('2d')
                        self.ball_x = data.ball_x
                        self.ball_y = data.ball_y
                        self.player1 = data.player1
                        self.player2 = data.player2
                                               
                        self.my_side
                        self.my_paddle = 0
                        self.enemy_paddle
                   
                        console.log("side before : " + self.my_side)
                        console.log("player1 : " + self.player1)
                        console.log("current : " + current_user)
                       

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
                            self.my_paddle = data.paddle1
                            self.enemy_paddle = data.paddle2
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
                        
                        document.addEventListener("keyup", (event) => {
                            var input;
                            switch (event.keyCode) {

                                case 38: {
                                    // console.log("GO UP")
                                    input = {side: self.my_side, movement: "/"}
				                    sub.perform('input', input)
                                    break;
                                }

                                case 40: {
                                    // console.log("GO DOWN")
                                    input = {side: self.my_side, movement: "/"}
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
                                ctx.fillRect(canvas.width - 25, self.my_paddle, 15, 80);
                                ctx.fillStyle = 'blue'
                                ctx.fillRect(10, self.enemy_paddle, 15, 80);
                            }
                            else
                            {
                                ctx.fillStyle = 'blue'
                                ctx.fillRect(10, self.my_paddle, 15, 80);
                                ctx.fillStyle = 'red'
                                ctx.fillRect(canvas.width - 25, self.enemy_paddle, 15, 80);
                            }
                           
                            // ball
                            ctx.beginPath()
                            ctx.arc(self.ball_x, self.ball_y, 10, 0, Math.PI*2)
                            ctx.fillStyle = 'blue'
                            ctx.fill()
                            ctx.closePath()

                            ctx.strokeStyle = "grey";
                            ctx.moveTo(300, 20);
                            ctx.lineTo(300, 380);
                            ctx.stroke();
       
                        }, 1/100);
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
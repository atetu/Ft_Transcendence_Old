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



const GameView = Backbone.View.extend({
    template: _.template($("script[id='template-game']").html()),
    initialize(options) {
        self = this
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
    draw() {
        // console.log(self.my_paddle)
        self.ctx.clearRect(0, 0, self.canvas_width, self.canvas_height)
        self.ctx.fillStyle = 'black';
        self.ctx.fillRect(0, 0, self.canvas_width, self.canvas_height)
    
        if (self.my_side) {
            self.ctx.fillStyle = 'blue'
            self.ctx.fillRect(self.canvas_width - 25, self.my_paddle, 15, 80);
            self.ctx.fillStyle = 'blue'
            self.ctx.fillRect(10, self.enemy_paddle, 15, 80);
        }
        else {
            // console.log("ICI")
            self.ctx.fillStyle = 'blue'
            self.ctx.fillRect(10, self.my_paddle, 15, 80);
            self.ctx.fillStyle = 'blue'
            // console.log("Width - 25: ")
            // var ret = parseInt(self.canvas_width) -25
            // console.log(ret)
            self.ctx.fillRect(self.canvas_width - 25, self.enemy_paddle, 15, 80);
        }

        // ball
        self.ctx.beginPath()
        self.ctx.arc(self.ball_x, self.ball_y, 10, 0, Math.PI * 2)
        self.ctx.fillStyle = 'blue'
        self.ctx.fill()
        self.ctx.closePath()

        self.ctx.strokeStyle = "grey";
        self.ctx.moveTo(300, 20);
        self.ctx.lineTo(300, 380);
        self.ctx.stroke();
        console.log("status: ")
        console.log(self.status)
        if(self.status == "over")
        {
            self.ctx.font = "30px Nunito";
            self.ctx.fillStyle = "red";
            self.ctx.textAlign = "center";
            self.ctx.fillText("GAME OVER", self.canvas_width/2, self.canvas_height/2);
        }
    },
    update_paddle()
    {
        var input
        console.log("=====================================================================")
        if (self.mov == 1)
        {
            console.log("GO UP")
            self.my_paddle +=1
            input = { side: self.my_side, movement: "up" }
            self.sub.perform('input', input)
        }
        if (self.mov == -1)
        {
            console.log("GO Down")
            self.my_paddle -=1
            input = { side: self.my_side, movement: "down" }
            self.sub.perform('input', input)
        }
    },
    connect() {
        console.log("***********************");
        this.game.set(
            "$subscriber",
            self.sub = consumer.subscriptions.create(
                {
                    channel: "GameChannel",
                    game_id: self.game.id,       // exemple
                },
                {
                    connected() {
                        console.log("connected(): ")
                        console.log(self.ball_x)
                        self.canvas = document.getElementById('myCanvas')
                        self.canvas_width = self.canvas.width = 600
                        self.canvas_height = self.canvas.height = 400
                        self.my_paddle = 5
                        self.enemy_paddle = 5
                        self.ball_x = 50
                        self.ball_y = 50
                        self.my_side = 0
                        self.mov = 0
                        self.status = "waiting"
                        self.ctx = self.canvas.getContext('2d')
                        setInterval(self.draw, 1000/60)
                    },
                    disconnected() {
                        console.log("disconnected(): ")

                    },
                    received(data) {
                        console.log("received)")
                        self.ball_x = data.ball_x
                        self.ball_y = data.ball_y
                        self.player1 = data.player1
                        self.player2 = data.player2
                        self.status = data.status
                        if (self.player1 == current_user.id)
                            self.my_side = 0
                        else
                            self.my_side = 1
                        if (self.my_side) {
                            self.my_paddle = data.paddle2
                            self.enemy_paddle = data.paddle1
                        }
                        else {
                            self.my_paddle = data.paddle1
                            self.enemy_paddle = data.paddle2
                        }
                       console.log("Before")
                       self.update_paddle()
                        document.addEventListener("keydown", (event) => {
                            switch (event.keyCode) {

                                case 38: {
                                    self.mov = 1
                                    // update_paddle("up")
                                    // console.log("GO UP")
                                    // var input = { side: self.my_side, movement: "up" }
                                    // sub.perform('input', input)
                                    break;
                                }

                                case 40: {
                                    self.mov = -1
                                    // update_paddle("down")
                                    // console.log("GO DOWN")
                                    // //self.my_paddle +=1
                                    // input = { side: self.my_side, movement: "down" }
                                    // sub.perform('input', input)
                                    break;
                                }
                            }
                       
                        });
                        
                        //setInterval(self.draw(), 1/10)
                     //   setInterval(self.draw(), 1/10)
                        document.addEventListener("keyup", (event) => {
                            switch (event.keyCode) {

                                case 38: {
                                    self.mov = 0
                                    // console.log("GO UP")
                                    // input = {side: self.my_side, movement: "/"}
                                    // sub.perform('input', input)
                                    break;
                                }

                                case 40: {
                                    self.mov = 0
                                    // console.log("GO DOWN")
                                    // input = {side: self.my_side, movement: "/"}
                                    // sub.perform('input', input)
                                    break;
                                }
                            }
                        });
                        
                    },
                }
            )
        )
    },
    disconnect() {
        consumer.subscriptions.remove(this.game.get("$subscriber"));
    },
});

export {
    GameView
};

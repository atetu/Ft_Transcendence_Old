import Backbone from "backbone";
import _ from "underscore";
import consumer from "../../channels/consumer"

const BallView = Backbone.View.extend({
    template: _.template($("script[id='template-ball']").html()),
    initialize(options) {
        this.ball = new BallModel({ id: options?.ball_id });
        this.y = 5;
        this.ballX = 100;
        this.ballY = 50;

        _.bindAll(this, "render", "connect");

        this.ball.on("change", this.render);
    
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
        console.log("***********************");
        this.ball.set(
            "$subscriber",
            consumer.subscriptions.create(
                {
                    channel: "BallChannel",
                    ball_id: self.ball.id,       // exemple
                    side: self.ball.side         // exemple
                },
                {
                    connected() {
                        console.log("connected(): ");
                        var canvas = document.getElementById('myCanvas');
                        var ctx = canvas.getContext('2d');
                    //    ctx.fillStyle = "#0000ff";
                        document.addEventListener("keydown", (event) => {
                            console.log(self.y);
                            switch (event.keyCode) {

                                case 38: {
                                    self.y -= 5;
                                    break;
                                }

                                case 40: {
                                    self.y += 5;
                                    break;
                                }
                            }
                        });
                        setInterval(() => {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
                            ctx.fillStyle = "#ff0000";
                            ctx.fillRect(5, self.y, 10, 50);
                            ctx.fillRect(self.ballX, self.ballY, 10, 10);
            
            
                            // if (mySide) /* left */ {
                            //     ctx.fillStyle = "#00ff00";
                            //     ctx.fillRect(5, y, 10, 50);
            
                            //     ctx.fillStyle = "#0000ff";
                            //     ctx.fillRect(canvas.width - 10 - 5, enemyPaddleY, 10, 50);
                            // } else {
                            //     ctx.fillStyle = "#00ff00";
                            //     ctx.fillRect(canvas.width - 10 - 5, y, 10, 50);
            
                            //     ctx.fillStyle = "#0000ff";
                            //     ctx.fillRect(5, enemyPaddleY, 10, 50);
                            // }
                        }, 1000 / 10);
                       
                        
                    },
                    disconnected() {
                        console.log("disconnected(): ");

                    },
                    received(data) {
                        console.log("received)");
                        var canvas = document.getElementById('myCanvas');
                        var ctx = canvas.getContext('2d');
                        ctx.fillStyle = "#0000ff";
                        ctx.fillRect(5, 5, 10, 50);
                    },
                }
            )
        )
    },
    disconnect() {
        consumer.subscriptions.remove(this.ball.get("$subscriber"));
    },
});

export{
    BallView
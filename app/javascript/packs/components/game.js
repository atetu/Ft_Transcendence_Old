import Backbone from "backbone";
import _ from "underscore";
import consumer from "../../channels/consumer"

console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

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

paddleMove() {
    document.addEventListener("keydown", (event) => {
        switch (event.keyCode) {

            case 38: {
                y -= 5;
                break;
            }

            case 40: {
                y += 5;
                break;
            }
        }
    })
};

const GameView = Backbone.View.extend({
    template: _.template($("script[id='template-game']").html()),
    initialize(options) {
        this.game = new GameModel({ id: options?.game_id });

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
        console.log("***********************");
        this.game.set(
            "$subscriber",
            consumer.subscriptions.create(
                {
                    channel: "GameChannel",
                    game_id: self.game.id,       // exemple
                    side: self.game.side         // exemple
                },
                
                {
                    connected() {
                        console.log("connected(): ");
                        var canvas = document.getElementById('myCanvas');
                        var ctx = canvas.getContext('2d');
                        ctx.fillStyle = "#0000ff";
                        var y = null;
                        y = paddleMove();
                        ctx.fillRect(5, y, 10, 50);
                        
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
        consumer.subscriptions.remove(this.game.get("$subscriber"));
    },
});

export{
    GameView
  };
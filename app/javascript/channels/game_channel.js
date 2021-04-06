// app/assets/javascripts/channels/chatrooms.js

//= require cable
//= require_self
//= require_tree .

// this.App = {};

// App.cable = ActionCable.createConsumer(); 

// import consumer from "./consumer";

// document.addEventListener("keydown", (event) => {
//     switch (event.keyCode) {

//         case 38: {
//             y -= 5;
//             break;
//         }

//         case 40: {
//             y += 5;
//             break;
//         }
//     }

//     socket.send(JSON.stringify({
//         type: "move",
//         y
//     }))
// })

// setInterval(() => {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     ctx.fillStyle = "#ff0000";
//     ctx.fillRect(ballX, ballY, 10, 10);


//     if (mySide) /* left */ {
//         ctx.fillStyle = "#00ff00";
//         ctx.fillRect(5, y, 10, 50);

//         ctx.fillStyle = "#0000ff";
//         ctx.fillRect(canvas.width - 10 - 5, enemyPaddleY, 10, 50);
//     } else {
//         ctx.fillStyle = "#00ff00";
//         ctx.fillRect(canvas.width - 10 - 5, y, 10, 50);

//         ctx.fillStyle = "#0000ff";
//         ctx.fillRect(5, enemyPaddleY, 10, 50);
//     }
// }, 1000 / 10);

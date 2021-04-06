import consumer from "./consumer"

const gameChannel = consumer.subscriptions.create({
	channel: "GameChannel",
	game: game_id,
},
{
	received(data) {

	}
}
)


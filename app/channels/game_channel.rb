class GameChannel < ApplicationCable::Channel
    def subscribed
      game = Game.find params[:game_id]
      stream_for game
    end

    def input(data)
      game = Game.find params[:game_id]
      puts "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
      puts data["movement"]
      game.input_from_front(data["side"], data["movement"])
    end
  end
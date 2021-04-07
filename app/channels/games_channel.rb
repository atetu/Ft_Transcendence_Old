class GamesChannel < ApplicationCable::Channel
    def subscribed
      game = Game.find params[:game]
      stream_for game
    end
  end
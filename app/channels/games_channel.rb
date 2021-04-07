class GamesChannel < ApplicationCable::Channel
    def subscribed
      game = Gme.find params[:game]
      stream_for game
    end
  end
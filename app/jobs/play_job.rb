class PlayJob < ApplicationJob
    queue_as :default
  
    def perform(game)
        # ball = Ball.new(game, next_hit)
        game.start
    end
end
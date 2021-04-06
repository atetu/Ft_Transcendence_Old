class GameController < ApplicationController
    def index
        @games = Game.all
      end
    
      def show
        @game = Game.find(params[:id])
      end
    
      def new
        @game = Game.new
      end
    
      def create
        players_game = Game.new(players_game_params)
        # players_game.save!
        render :json => players_game
      end

      def players_game_params
        params.permit(
          :game_id,
          :player_id,
          :position,
          :score
        )
      end
   
end

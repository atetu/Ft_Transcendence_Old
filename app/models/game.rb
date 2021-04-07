class Game < ApplicationRecord

    enum status: [:waiting, :playing, :over]

  #   has_many :users, dependent: :destroy
  #   has_one :ball, dependent: :destroy
  #   has_many :paddle, dependent: :destroy

  #   validates :game_id, uniqueness: {scope: [:position]}
  #   validates :player_id, uniqueness: {scope: [:game_id]}
    

  #   after_create :broadcast
  #   after_commit :play

  #   def left_player
  #       user(:left)
  #   end

  #   def right_player
  #       user(:right)
  #   end

  #   def score(position)
  #       pg = game.find_by(position: position)
  #       pg.increment(:score).save
  #   end

  #   def data
  #       game_data = self.attributes
  #       game_data["left_player"] = left_player
  #       game_data["right_player"] = right_player
  #       game_data
  #   end

  #   def broadcast
  #       ActionCable.server.broadcast "games_channel", data
  #   end

  #   private

  #   def select_stmt
  #       "users.id, users.name, players_games.score"
  #   end

  #   def player(position)
  #       User
  #       .joins(:players_games)
  #       .select(select_stmt)
  #       .where(
  #           "players_games.game_id = ? AND players_games.position = ?",
  #           self.id,
  #           PlayersGame.positions[position]
  #       ).first
  #   end

  #   def play
  #       if playing?
  #       PongJob.perform_later(self)
  #       end
  #   end

  #   private

  # def update_game
  #   if game.waiting? && game.players_games.count == 2
  #     game.playing!
  #   elsif game.playing? && score >= 10
  #     game.over!
  #   end
  # end

  # def broadcast_game
  #   game.broadcast
  # end
end

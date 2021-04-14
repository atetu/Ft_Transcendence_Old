class Game < ApplicationRecord
  
  enum status: [:waiting, :playing, :over]
  has_many :players, dependent: :destroy
    # has_one :ball, dependent: :destroy
    # has_many :paddle, dependent: :destroy

    # after_create :play
  def initialize(game)
    @ball_x = 50
     @ball_y = 50
      # @vel_x = nil
      # @vel_y = nil
  end
   
  def data
    {
      ball_y: @ball_y,
      ball_x: @ball_x,
      paddle1: @paddle1,
      paddle2: @paddle2,
      side: @side
    }
  end

  def broadcast
    puts data
    GameChannel.broadcast_to self, data
  end

  # def input_from_front(side, movement)
  #   if side == 0
  #     @paddle1 += movement
  #   else
  #     @paddle2 += movement
  # end
  

  def start
    @ball_x = 0
    @ball_y = 0
    @y = 50
    loop do 
      broadcast
      @ball_x += 1
      @ball_y += 1
      sleep 1
    end
  end
end

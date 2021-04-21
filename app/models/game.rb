class Game < ApplicationRecord
  
  enum status: [:waiting, :playing, :over]
  has_many :players, dependent: :destroy
    # has_one :ball, dependent: :destroy
    # has_many :paddle, dependent: :destroy

    # after_create :play
  def initialize(game)
    # @ball_x = 50
    # @ball_y = 50
    $redis.set("ball_x:#{@id}", 50)
    $redis.set("ball_y:#{@id}", 50)
    $redis.set("left:#{@id}", 5)
    $redis.set("right:#{@id}", 5)
      # @vel_x = nil
      # @vel_y = nil
  end
   
  def data
    {
      ball_x: $redis.get("ball_x:#{@id}"),
      ball_y: $redis.get("ball_y:#{@id}"),
      paddle1: $redis.get("left:#{@id}"),
      paddle2: $redis.get("right:#{@id}"),
      side: @side
    }
  end

  def broadcast
    # puts data
    GameChannel.broadcast_to self, data
  end

  

  def start
    # @ball_x = 0
    # @ball_y = 0
    # @y = 50
    # @down = 0;
    $redis.set("left:#{@id}", 5)
    $redis.set("right:#{@id}", 5)
    $redis.set("ball_x:#{@id}", 50)
    $redis.set("ball_y:#{@id}", 50)
    loop do 
      broadcast
      ball_x = $redis.get("ball_x:#{@id}")
      ball_y = $redis.get("ball_y:#{@id}")
      puts "%%%%%%%%%%%%%%%%%%%%%"
      puts ball_x
      ball_x = ball_x.to_i + "30".to_i
      ball_y = ball_y.to_i + "10".to_i
      $redis.set("ball_x:#{@id}", ball_x)
      $redis.set("ball_y:#{@id}", ball_y)
      sleep 1
    end
  end

 
end

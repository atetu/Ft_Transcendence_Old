class Game < ApplicationRecord
  
  enum status: [:waiting, :playing, :over]
  has_many :user, dependent: :destroy
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
      player1: player1_id,
      player2: player2_id
    }
  end

  def broadcast
    puts data
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
    @vel_x = 4/4;
    @vel_y = 3/4;
    @direction = 1;
    @canvas_width = 600
    @canvas_height = 400
    loop do 
      broadcast
      if !update_ball
        break
      end
      # ball_x = $redis.get("ball_x:#{@id}")
      # ball_y = $redis.get("ball_y:#{@id}")
      # ball_x = ball_x.to_i + "30".to_i
      # ball_y = ball_y.to_i + "10".to_i
      # $redis.set("ball_x:#{@id}", ball_x)
      # $redis.set("ball_y:#{@id}", ball_y)
      sleep 1/4
    end
  end

  def update_ball()
    ball_x = $redis.get("ball_x:#{@id}")
    ball_y = $redis.get("ball_y:#{@id}")
    # if ball_x.to_f + "5".to_f >= @canvas_width.to_f - "25".to_f && ball_x.to_f + "5".to_f <= @canvas_width.to_f - "10".to_f && ball_y.to_f + "5".to_f >= @paddle2.to_f && ball_y.to_f + "5".to_f <= @paddle2.to_f + "80".to_f
    #   puts "strike"
    # end
    radius = "5".to_f * @direction
    if ((ball_x.to_f + radius.to_f) < "0" .to_f ||  (ball_x.to_f + radius.to_f) > @canvas_width.to_f ||
      (ball_y.to_f + radius.to_f) < "0".to_f || (ball_y.to_f + radius.to_f) > @canvas_height.to_f)
      return 0
    end
    if (((ball_x.to_f + radius.to_f) >= ("10".to_f) && (ball_x.to_f + radius.to_f) <= ("25".to_f) && (ball_y.to_f + radius.to_f) >= (@paddle1.to_f) && (ball_y.to_f + radius.to_f) <= (@paddle1.to_f + "80".to_f)) ||
      (ball_x.to_f + radius.to_f >= @canvas_width.to_f - "25".to_f && ball_x.to_f + radius.to_f <= @canvas_width.to_f - "10".to_f && ball_y.to_f + radius.to_f >= @paddle2.to_f && ball_y.to_f + radius.to_f <= @paddle2.to_f + "80".to_f))
      @direction*= -1
    end
    ball_x = ball_x.to_i + @vel_x.to_f * @direction.to_f
    ball_y = ball_y.to_i + @vel_y.to_f * @direction.to_f
    $redis.set("ball_x:#{@id}", ball_x)
    $redis.set("ball_y:#{@id}", ball_y)
    return 1
  end

 
end

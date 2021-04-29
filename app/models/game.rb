class Game < ApplicationRecord
  
  enum status: [:waiting, :playing, :over]
  has_many :user, dependent: :destroy
    # has_one :ball, dependent: :destroy
    # has_many :paddle, dependent: :destroy

    # after_create :play
  def initialize(game)
    # @ball_x = 50
    # @ball_y = 50
    # $redis.set("ball_x:#{@id}", 50)
    # $redis.set("ball_y:#{@id}", 50)
    $redis.set("left:#{@id}", 5)
    $redis.set("right:#{@id}", 5)
      # @vel_x = nil
      # @vel_y = nil
  end
   
  def data
    {
      ball_x: @ball_x,
      ball_y: @ball_y,
      paddle1: $redis.get("left:#{@id}"),
      paddle2: $redis.get("right:#{@id}"),
      player1: player1_id,
      player2: player2_id,
      status: @status
    }
  end

  def broadcast
    puts data
    GameChannel.broadcast_to self, data
  end

  

  def start
    @ball_x = 50
    @ball_y = 50
    $redis.set("left:#{@id}", 5)
    $redis.set("right:#{@id}", 5)
    a = 2.to_f
    b = 3.to_f
    c = 2.to_f
    @vel_x = a/b
    @vel_y = c/b
    @direction = 1
    @canvas_width = 600
    @canvas_height = 400
    puts "ball : " 
    puts @ball_x
    @status = "playing"
    loop do 
      broadcast
      update_ball
      if (@status == "over")
        break
      end
      sleep 1/4
    end
    broadcast
    sleep
    puts "OVER"
  end

  def update_ball()
    radius = "5".to_f * @direction
    puts "ball 2 : " 
    puts @ball_x
    if ((@ball_x.to_f + radius.to_f) <= "0".to_f ||  (@ball_x.to_f + radius.to_f) >= @canvas_width.to_f)
      puts "=+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
      @status = "over"
      return 0
    end
    if ((@ball_y.to_f + radius.to_f) <="0".to_f || (@ball_y.to_f + radius.to_f) >= @canvas_height.to_f)
      @vel_y*= -1
    end
    if (((@ball_x.to_f + radius.to_f) >= ("10".to_f) && (@ball_x.to_f + radius.to_f) <= ("25".to_f) && (@ball_y.to_f + radius.to_f) >= (@paddle1.to_f) && (@ball_y.to_f + radius.to_f) <= (@paddle1.to_f + "80".to_f)) ||
      (@ball_x.to_f + radius.to_f >= @canvas_width.to_f - "25".to_f && @ball_x.to_f + radius.to_f <= @canvas_width.to_f - "10".to_f && @ball_y.to_f + radius.to_f >= @paddle2.to_f && @ball_y.to_f + radius.to_f <= @paddle2.to_f + "80".to_f))
      @direction*= -1
    end
    @ball_x = @ball_x.to_f + @vel_x.to_f * @direction.to_f
    @ball_y = @ball_y.to_f + @vel_y.to_f * @direction.to_f
    puts "////////////////////////////////////////////////////////////////////////////////////////////////////"
    puts "ball x"
    puts @ball_x
    puts "vel"
    puts @vel_x.to_f
    if (@ball_x <= "0".to_f || @ball_x >= @canvas_width.to_f || @ball_y <= "0".to_f || @ball_y >= @canvas_height.to_f)
      puts "////////////////////////////////////////////////////////////////////////////////////////////////////"
      @satus = "over"
      return 0
    end
    return 1
  end

 
end

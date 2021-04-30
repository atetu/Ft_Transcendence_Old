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
    # puts data
    GameChannel.broadcast_to self, data
  end

  def check_collision(x, y)
    radius = 5
    # if (side == 0)
    #   width = x + 15
    # else
    #   width = x + 15
    # end
    dist = (x.to_f - @ball_x.to_f) * (x.to_f - @ball_x.to_f) + (y.to_f - @ball_y.to_f) * (y.to_f - @ball_y.to_f)
		if (dist <= radius * radius)
		  return 1
    end
    return 0
  end

  def check_up_and_down(x, y)
    i = x
    while i.to_f <= x.to_f + 15.to_f
      ret = check_collision(i, y)
      # puts "ret up -d : "
      # puts ret
      if ret == 1
        return (1)
      end
      i = i.to_f + 1.to_f
    end
    return 0
  end

  def check_side(x, y)
    i = y
    while i.to_f <= y.to_f + 80.to_f
      ret = check_collision(x, i)
      # puts "ret side: "
      # puts ret
      if ret == 1
        return (1)
      end
      i = i.to_f + 1.to_f
    end
    return(0)
  end

  def collision()
    # paddle
    # x
    if @direction == -1
      paddle = $redis.get("left:#{@id}")
      x = 10.to_f
      x_side = 10.to_f + 15.to_f
      # side = 0
    else
      paddle = $redis.get("right:#{@id}")
      x = @canvas_width - 25
      x_side = x
      # side = 1
    end
    # ret1 = check_up_and_down(x, paddle)
    # ret 2 = check_up_and_down(x, paddle.to_f + 80.to_f)
    # ret 3 = 
    if check_up_and_down(x, paddle) == 1.to_i || check_up_and_down(x, paddle.to_f + 80.to_f) == 1.to_i || check_side(x_side.to_f, paddle).to_i == 1.to_f
      # puts "return 1 in collision"
      return 1
    end
    return 0
  end

  def update_ball()
    radius = "5".to_f * @direction
    rad = 5
    # puts "ball 2 : " 
    # puts @ball_x
    if ((@ball_x.to_f + radius.to_f) <= "0".to_f ||  (@ball_x.to_f + radius.to_f) >= @canvas_width.to_f)
      puts "=+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
      @status = "over"
      return 0
    end
    if ((@ball_y.to_f - rad.to_f) <="0".to_f || (@ball_y.to_f + rad.to_f) >= @canvas_height.to_f)
      @vel_y*= -1
    end
    # if (((@ball_x.to_f + radius.to_f) >= ("10".to_f) && (@ball_x.to_f + radius.to_f) <= ("25".to_f) && (@ball_y.to_f + radius.to_f) >= (@paddle1.to_f) && (@ball_y.to_f + radius.to_f) <= (@paddle1.to_f + "80".to_f)) ||
    #   (@ball_x.to_f + radius.to_f >= @canvas_width.to_f - "25".to_f && @ball_x.to_f + radius.to_f <= @canvas_width.to_f - "10".to_f && @ball_y.to_f + radius.to_f >= @paddle2.to_f && @ball_y.to_f + radius.to_f <= @paddle2.to_f + "80".to_f))
    #   @direction*= -1
    # end
    ret = collision
    puts "ret collision : "
    puts ret
    if ret == 1
      @direction*= -1
    end
    @ball_x = @ball_x.to_f + @vel_x.to_f * @direction.to_f
    @ball_x = @ball_x.round(1)
    @ball_y = @ball_y.to_f + @vel_y.to_f * @direction.to_f
    @ball_y = @ball_y.round(1)
    # puts "////////////////////////////////////////////////////////////////////////////////////////////////////"
    # puts "ball x"
    # puts @ball_x
    # puts "vel"
    # puts @vel_x.to_f
    # if (@ball_x <= "0".to_f || @ball_x >= @canvas_width.to_f || @ball_y <= "0".to_f || @ball_y >= @canvas_height.to_f)
    #   puts "////////////////////////////////////////////////////////////////////////////////////////////////////"
    #   @satus = "over"
    #   return 0
    # end
    return 1
  end


  def start
    @ball_x = 50
    @ball_y = 50
    $redis.set("left:#{@id}", 5)
    $redis.set("right:#{@id}", 5)
    a = 5.to_f
    b = 3.to_f
    c = 2.to_f
    @vel_x = a
    @vel_y = b/c
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

  
  
end

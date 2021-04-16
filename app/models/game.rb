class Game < ApplicationRecord
  
  enum status: [:waiting, :playing, :over]
  has_many :players, dependent: :destroy
    # has_one :ball, dependent: :destroy
    # has_many :paddle, dependent: :destroy

    # after_create :play
  def initialize(game)
    @ball_x = 50
    @ball_y = 50
    $redis.set("left", 0)
    $redis.set("right", 0)
      # @vel_x = nil
      # @vel_y = nil
  end
   
  def data
    {
      ball_y: @ball_y,
      ball_x: @ball_x,
      paddle1: $redis.get("right"),
      paddle2: $redis.get("left"),
      side: @side
    }
  end

  def broadcast
    # puts data
    GameChannel.broadcast_to self, data
  end

  # def input_from_front(side, movement)
  #   puts "????????????????????????"
  #   if (movement == "down")
  #     @down += 1
  #   # paddle2 = @paddle2
  #   # paddle2 += 1
  #   puts @down
  #   # if side == 0
  #   #   if @paddle1 == nil
  #   #     if movement == "down"
  #   #       @paddle1 = 1
  #   #     end
  #   #   else
  #   #     if movement == "down"
  #   #       @paddle1 += 1
  #   #     else
  #   #       @paddle1 -= 1
  #   #     end
  #   #   end
  #   # end
  #   # if side == 1
  #   #   if @paddle2 == nil
  #   #     if movement == "down"
  #   #             @paddle2 = 1
  #   #     else
  #   #       if movement == "down"
  #   #         @paddle2 += 1
  #   #       else
  #   #         @paddle2 -= 1
  #   #       end
  #   #     end
  #   #   end
  #   end
     
  #     puts "***************************************************************************************"
  #     puts @paddle2
  #   # elsif side == 1
  #     # @paddle2 += movement
  #     # puts "***************************************************************************************"
  #     # puts @paddle2
  #   # end
  #  @paddle2.save
  # end
  
  # def moveDown
  #   puts "+++++++++++++++++"
  #   @paddle2 += 1
  #   puts @paddle2
  # end

  def start
    @ball_x = 0
    @ball_y = 0
    @y = 50
    @down = 0;
    # $redis.set("left:#{@id}", 0)
    $redis.set("left", 0)
    $redis.set("right", 0)
    loop do 
      broadcast
      @ball_x += 1
      @ball_y += 1
      sleep 1
    end
  end

 
end

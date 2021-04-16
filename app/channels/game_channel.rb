class GameChannel < ApplicationCable::Channel
    def subscribed
      game = Game.find params[:game_id]
      stream_for game
    end

    def input(data)
      game = Game.find params[:game_id]
      puts "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
      puts data["movement"]
      if (data["side"] == 0)
         right = $redis.get("right");
         right = update(right, data["movement"])
         $redis.set("right", right)
      end
      if (data["side"] == 1)
        left = $redis.get("left");
        left = update(left, data["movement"])
        $redis.set("left", left)
      end
     end
    
      
      # $redis.set("left:#{params[:game_id]}", data["movement"])
     
     
      # left = $redis.get("left:#{params[:game_id]}")
      # puts left
      # game.input_from_front(data["side"], data["movement"])
      # if data["side"] == 0
      #   $redis.with do |conn|
      #     conn.set("left:#{params[:game.id]}", data["movement"])
      #   end
      # else
      #   $redis.with do |conn|
      #     conn.set("right:#{params[:game_id]}", data["movement"])
      #   end
      # end
 

    def update(paddle, movement)
      if movement == "down"
        paddle = paddle.to_i + "1".to_i
      end
      if movement == "up"
        paddle = paddle.to_i - "1".to_i
      end
      return paddle
    end
  end
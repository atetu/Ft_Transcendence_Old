class GameChannel < ApplicationCable::Channel
    def subscribed
      @game = Game.find params[:game_id]
      stream_for @game
    end

    def input(data)
      # game = Game.find params[:game_id]
      # puts "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
      # puts data["movement"]
      if (data["side"] == 0)
         right = $redis.get("right:#{@game.id}");
         right = update_paddle(right, data["movement"])
         $redis.set("right:#{@game.id}", right)
      end
      if (data["side"] == 1)
        left = $redis.get("left:#{@game.id}");
        left = update_paddle(left, data["movement"])
        $redis.set("left:#{@game.id}", left)
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
 

    def update_paddle(paddle, movement)
      if movement == "down"
        paddle = paddle.to_f + "0.2".to_f
      end
      if movement == "up"
        paddle = paddle.to_f - "0.2".to_f
      end
      return paddle
    end

  end
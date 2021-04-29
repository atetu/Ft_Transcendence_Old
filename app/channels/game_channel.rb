class GameChannel < ApplicationCable::Channel
    def subscribed
      @game = Game.find params[:game_id]
      stream_for @game
    end

    def input(data)
      if (data["side"] == 0)
        right = update_paddle("right", data["movement"])
      end
      if (data["side"] == 1)
        left = update_paddle("left", data["movement"])
        # $redis.set("left:#{@game.id}", left)
      end

     end

    def update_paddle(paddle, movement)
      if movement == "down"
        if paddle == "right"
          $redis.incr("right:#{@id}")
        elsif paddle == "left"
          $redis.incr("left:#{@id}")
        end
      end
      # right = $redis.get("right:#{@id}")
      # puts right
      # left = $redis.get("left:#{@id}")
      # puts left
      if movement == "up"
        if paddle == "right"
          $redis.decr("right:#{@id}")
        elsif paddle == "left"
          $redis.decr("left:#{@id}")
        end
      end
    end

  end
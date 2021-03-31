class Ball
    has_one game
    @ball_x = 25
    @ball_y = 50
    @ball_vel_x = 3
    @ball_vel_y = 3

    def initialize(game)
        @game = game
    end
    
    def move
        @ball_x += @ball_vel_x;
        @ball_y += ball_vel_y;

        if (((@ball_x < 0 || @ball_x > 150) && in?) {
            @ball_vel_x *= -1;
        }

        if ((@ball_y < 0 || @ball_y> 150) && !out? {
            ball_vel_y *= -1;
    end
    
    def in?
        @ball_x >= paddle1.x1 && @ball_x <= paddle1.x2
            && @ball_y >= paddle1.y1 && @ball_y <=paddle1.y2
        @ball_x >= paddle1.x1 && @ball_x <= paddle1.x2
            && @ball_y >= paddle1.y1 && @ball_y <=paddle1.y2
    end
end

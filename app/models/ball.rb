class Ball < ApplicationRecord
    BALL_X = 25
    BALL_Y = 50
    BALL_VEL_X = 3
    BALL_VEL_Y = 3

    def initialize(game)
        @game = game
    end
    
    def move
        BALL_X += BALL_VEL_X;
        BALL_Y += BALL_VEL_Y;

        if ((BALL_X < 0 || BALL_X > 150) {
            BALL_VEL_X *= -1;
        }

        if (BALL_Y < 0 || BALL_Y> 150) {
            BALL_VEL_Y *= -1;
    end
    
    def out
        if(BALL_X >= paddle1.x1 && BALL_X <= paddle1.x2
            && BALL_Y >= paddle1.y1 && BALL_Y <=paddle1.y2)
        return (true);
        if(BALL_X >= paddle1.x1 && BALL_X <= paddle1.x2
            && BALL_Y >= paddle1.y1 && BALL_Y <=paddle1.y2)
        return (true);
end

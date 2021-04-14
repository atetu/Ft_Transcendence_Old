# class Ball
#     has_one game
#     @ball_x = 25
#     @ball_y = 50
#     @ball_vel_x = 3
#     @ball_vel_y = 3

#     def initialize(game)
#         @game = game
#         @ballX = 318
#         @ballY = 232
#         @velX = nil
#         @velY = nil
#     end
    
#     def start
#         @ballX += @velX;
#         @ballY += @velY;

#         if (((@ballX < 0 || @ballX > 150)) {
#             @velX *= -1;
#         }

#         if ((@ballY < 0 || @ballY> 150) {
#             velY *= -1;
#     end
    
#     def in?
#         @ballX >= paddle1.x1 && @ball_x <= paddle1.x2
#             && @ball_y >= paddle1.y1 && @ball_y <=paddle1.y2
#         @ball_x >= paddle1.x1 && @ball_x <= paddle1.x2
#             && @ball_y >= paddle1.y1 && @ball_y <=paddle1.y2
#     end
# end

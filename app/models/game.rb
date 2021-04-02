class Game < ApplicationRecord

    enum status: [:waiting, :playing, :over]

    # has_many :players, dependent: :destroy
    # has_one :ball, dependent: :destroy
    # has_many :paddle, dependent: :destroy

    
end

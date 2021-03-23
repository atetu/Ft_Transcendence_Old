class Message < ApplicationRecord
  belongs_to :user
  belongs_to :chatroom, inverse_of: :messages

  def as_json(options)
    super(options).merge(user_avatar_url: user.gravatar_url)
  end
end

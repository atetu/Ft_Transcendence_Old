class Message < ApplicationRecord
  enum content_type: [:text, :invite]

  belongs_to :user
  belongs_to :chatroom, inverse_of: :messages

  validates :content, :presence => true, :length => { in: 1..200, allow_nil: false }

  def as_json(options)
    super(options).merge(user_avatar_url: user.gravatar_url)
  end
end

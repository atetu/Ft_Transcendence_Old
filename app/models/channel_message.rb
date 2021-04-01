class ChannelMessage < ApplicationRecord
  enum content_type: [:text, :invite]

  belongs_to :user
  belongs_to :channel

  validates :content, presence: true
end

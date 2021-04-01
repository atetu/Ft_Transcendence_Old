class Channel < ApplicationRecord
  enum visibility: [:public, :protected, :private], _prefix: :is

  belongs_to :owner, class_name: "User"

  has_many :members, class_name: "ChannelUser"
  has_many :messages, dependent: :destroy, inverse_of: :channel, class_name: "ChannelMessage"
end

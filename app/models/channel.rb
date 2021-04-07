class Channel < ApplicationRecord
  enum visibility: [:public, :protected, :private], _prefix: :is

  belongs_to :owner, class_name: "User"

  has_many :members, dependent: :destroy, inverse_of: :channel, class_name: "ChannelUser"
  has_many :messages, dependent: :destroy, inverse_of: :channel, class_name: "ChannelMessage"

  has_secure_password :validations => false

  validates :name, presence: true
  validates :visibility, presence: true
  validates :password, :presence => true, :if => Proc.new { |x| x.visibility == "protected" }
  validates :password, :absence => { :message => "can only be set for protected channels" }, :if => Proc.new { |x| x.visibility != "protected" }
  validates_length_of :password, minimum: 3, maximum: ActiveModel::SecurePassword::MAX_PASSWORD_LENGTH_ALLOWED, :if => Proc.new { |x| x.visibility == "protected" }
  validates_length_of :name, minimum: 3, maximum: 20
  validate_enum_attributes :visibility
end

class Chatroom < ApplicationRecord
  enum visibility: [:public, :protected, :private], _prefix: :is

  has_many :messages, dependent: :destroy, inverse_of: :chatroom

  belongs_to :owner, class_name: "User"

  validates :name, presence: true, :length => { in: 1..20, allow_nil: false }
  validates :slug, presence: true, uniqueness: true
  validate_enum_attributes :visibility
  validates :password, :presence => true, :length => { in: 8..20, allow_nil: false }, :if => Proc.new { |x| x.visibility == "protected" }
  validates :password, :absence => { :message => "can only be set for protected chatroom" }, :if => Proc.new { |x| x.visibility != "protected" }
end

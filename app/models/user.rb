class User < ApplicationRecord
  devise :database_authenticatable,
    :validatable,
    :omniauthable,
    omniauth_providers: [:marvin]

  validates :username, uniqueness: true, presence: true

  has_many :games
  
  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token
      user.username = auth.info.nickname
    end
  end

  def gravatar_url
    gravatar_id = Digest::MD5::hexdigest(email).downcase
    "https://gravatar.com/avatar/#{gravatar_id}.png"
  end
end

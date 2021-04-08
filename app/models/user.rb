class User < ApplicationRecord
  include Rails.application.routes.url_helpers

  devise :omniauthable,
         omniauth_providers: [
           #TODO MARVIN :marvin,
           :google_oauth2,
         ]

  has_one_attached :avatar

  validates :username, uniqueness: true, presence: true

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.username = auth.info.nickname
      user.username ||= auth.info.email.split(/@/, 2)[0]
      user.avatar.attach(io: URI.open(auth.info.image), filename: "#{user.username}.png")
    end
  end

  def picture
    rails_blob_path(avatar, only_path: true) if avatar.attached?
  end
end

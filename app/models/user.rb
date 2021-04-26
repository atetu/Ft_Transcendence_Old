class User < ApplicationRecord
  include Rails.application.routes.url_helpers

  has_one_time_password

  after_create :create_statistics
  after_create :give_registered_achivement

  devise(
    :omniauthable,
    omniauth_providers: [
      #TODO MARVIN :marvin,
      :google_oauth2,
    ],
  )

  has_one :statistics, dependent: :destroy, inverse_of: :user, class_name: "UserStatistics"
  has_one_attached :avatar
  has_many :achievement_progress, dependent: :destroy, inverse_of: :user

  validates :username, uniqueness: true, presence: true

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.username = auth.info.nickname
      user.username ||= auth.info.email.split(/@/, 2)[0]
      user.avatar.attach(io: URI.open(auth.info.image), filename: "#{user.username}.png")
      user.admin = (User.count() == 0) # is first user?
      user.otp_secret_key = nil
    end
  end

  def picture()
    rails_blob_path(avatar, only_path: true) if avatar.attached?()
  end

  private

  def create_statistics()
    UserStatistics.create!(
      user: self,
    )
  end

  def give_registered_achivement()
    Achievement.REGISTERED.give(self)
  end
end

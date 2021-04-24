class ChannelUserController < ApplicationController
  before_action :load_entities

  def all()
    render({
      json: ChannelMemberBlueprint.render(
        @channel.members.includes(:user)
      ),
    })
  end

  def get()
    load_entities(true)

    channel_user = ChannelUser.find_by(
      user: @user,
      channel: @channel,
    )

    if channel_user.blank?
      raise Api::Channel::UserNotInChannelException.new(@channel)
    end

    render({
      json: ChannelMemberBlueprint.render(channel_user),
    })
  end

  def add()
    load_entities(true)

    @channel.is_owner!(current_user)

    if ChannelUser.exists?(user: @user, channel: @channel)
      raise Api::Channel::UserAlreadyInChannelException.new(@channel)
    end

    channel_user = ChannelUser.create!(
      user: @user,
      channel: @channel,
    )

    render({
      json: ChannelMemberBlueprint.render(channel_user),
    })
  end

  def remove()
    load_entities(true)

    @channel.is_owner!(current_user)

    if current_user == @user
      raise Api::Channel::OwnerCannotBeRemoved.new(@channel)
    end

    channel_user = ChannelUser.find_by(
      user: @user,
      channel: @channel,
    )

    if channel_user.blank?
      raise Api::Channel::UserNotInChannelException.new(@channel)
    end

    channel_user.destroy()

    render({
      json: ChannelMemberBlueprint.render(channel_user),
    })
  end

  private

  def load_entities(with_user = false)
    @channel = Channel.find(params[:channel_id])

    if (with_user)
      @user = User.find(params[:user_id])
    end
  end
end

class ChannelMemberUserBlueprint < Blueprinter::Base
  identifier :id

  fields :username
end

class ChannelMemberBlueprint < Blueprinter::Base
  fields :banned, :admin, :muted
  association :user, blueprint: ChannelMemberUserBlueprint
end

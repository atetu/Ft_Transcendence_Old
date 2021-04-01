class ChannelUserController < ApplicationController
  before_action :load_entities

  def all
    render json: ChannelMemberBlueprint.render(
      @channel.members.includes(:user)
    )
  end

  def post
  end

  private

  def load_entities
    @channel = Channel.find params[:channel_id]
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

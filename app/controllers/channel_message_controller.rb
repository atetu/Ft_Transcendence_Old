class ChannelMessageController < ApplicationController
  before_action :load_entities

  def all
    render json: ChannelMessageBlueprint.render(
      @channel.messages.includes(:user),
      view: :user,
    )
  end

  def post
  end

  private

  def load_entities
    @channel = Channel.find params[:channel_id]
  end
end

class ChannelMessageChannelBlueprint < Blueprinter::Base
  identifier :id

  fields :name
end

class ChannelMessageUserBlueprint < Blueprinter::Base
  identifier :id

  fields :username
end

class ChannelMessageBlueprint < Blueprinter::Base
  identifier :id

  fields :content_type, :content, :updated_at, :created_at

  view :channel do
    association :channel, blueprint: ChannelMessageChannelBlueprint
  end

  view :user do
    association :user, blueprint: ChannelMessageUserBlueprint
  end

  view :extended do
    include_view :channel
    include_view :user
  end
end

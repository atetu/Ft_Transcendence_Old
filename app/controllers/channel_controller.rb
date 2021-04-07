class ChannelController < ApplicationController
  def all
    render json: ChannelBlueprint.render(Channel.includes(:owner))
  end

  def get
    load_entities

    render json: ChannelBlueprint.render(
      @channel,
      view: :members,
    )
  end

  def create
    args = permitted_parameters

    channel = Channel.create!(
      name: args[:name],
      visibility: args[:visibility],
      password: args[:password],
      owner: current_user,
    )

    render json: ChannelBlueprint.render(channel)
  end

  private

  def load_entities
    @channel = Channel.find params[:id]
  end

  def permitted_parameters
    params.permit(:name, :visibility, :password)
  end
end

class ChannelOwnerBlueprint < Blueprinter::Base
  identifier :id

  fields :username
end

class ChannelMemberUserBlueprint < Blueprinter::Base
  identifier :id

  fields :username
end

class ChannelMemberBlueprint < Blueprinter::Base
  fields :banned, :admin, :muted
  association :user, blueprint: ChannelMemberUserBlueprint
end

class ChannelBlueprint < Blueprinter::Base
  identifier :id

  fields :name, :owner, :visibility, :updated_at, :created_at
  association :owner, blueprint: ChannelOwnerBlueprint

  view :members do
    association :members, blueprint: ChannelMemberBlueprint
  end
end

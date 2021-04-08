class UserController < ApplicationController
  def current
    render json: UserBlueprint.render(current_user)
  end

  def all
    render json: UserBlueprint.render(User.all)
  end

  def show
    load_entities

    render json: UserBlueprint.render(
      @user,
      view: :full,
    )
  end

  private

  def load_entities
    @user = User.find params[:id]
  end
end

class UserStatisticsBlueprint < Blueprinter::Base
  fields :win_count, :loss_count
end

class UserBlueprint < Blueprinter::Base
  identifier :id

  fields :username, :email, :picture, :updated_at, :created_at

  view :full do
    association :statistics, blueprint: UserStatisticsBlueprint
  end
end

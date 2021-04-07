class UserController < ApplicationController
  def current
    render json: UserBlueprint.render(current_user)
  end
end

class UserBlueprint < Blueprinter::Base
  identifier :id

  fields :username, :email, :picture, :updated_at, :created_at
end

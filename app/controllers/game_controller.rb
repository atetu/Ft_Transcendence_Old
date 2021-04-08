class GameController < ApplicationController
  def all
    render json: Game.all
  end

  def get
    load_entities

    render json: @game
  end

  def create
    args = permitted_parameters

    game = Game.create!(
    )

    render json: game
  end

  def edit
    load_entities

    @game.assign_attributes(permitted_parameters)
    @game.save!

    render json: @game
  end

  private

  def load_entities
    @game = Game.find params[:id]
  end

  def permitted_parameters
    params.permit()
  end
end

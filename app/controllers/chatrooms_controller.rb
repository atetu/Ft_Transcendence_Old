class ChatroomsController < ApplicationController
  before_action :load_entities

  def index
    @chatrooms = Chatroom.all
  end

  def show
    @message = Message.new chatroom: @chatroom
    @messages = @chatroom.messages.includes(:user)
  end

  def new
    @chatroom = Chatroom.new
  end

  def create
    @chatroom = Chatroom.new permitted_parameters

    if @chatroom.save
      flash[:success] = "Chatroom #{@chatroom.name} was created successfully"
      redirect_to chatrooms_path
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @chatroom.update_attributes(permitted_parameters)
      flash[:success] = "Chatroom #{@chatroom.name} was updated successfully"
      redirect_to chatrooms_path
    else
      render :new
    end
  end

  protected

  def load_entities
    @chatrooms = Chatroom.all
    @chatroom = Chatroom.find(params[:id]) if params[:id]
  end

  def permitted_parameters
    params.require(:chatroom).permit(:name)
  end
end

class MessagesController < ApplicationController
  before_action :load_entities

  def create
    @message = Message.create user: current_user, chatroom: @chatroom, message: params.dig(:message, :message)
	
	ChatroomChannel.broadcast_to @chatroom, @message
  end

  protected

  def load_entities
    @chatroom = Chatroom.find params.dig(:message, :chatroom_id)
  end
end

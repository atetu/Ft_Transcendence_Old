class MessagesController < ApplicationController
  before_action :load_entities

  def create
    @message = Message.create!(
      user: current_user,
      chatroom: @chatroom,
      content_type: Message.content_types[:text],
      content: params.dig(:message, :content),
    )

    ChatroomChannel.broadcast_to @chatroom, @message
  end

  protected

  def load_entities
    @chatroom = Chatroom.find params.dig(:message, :chatroom_id)
  end
end

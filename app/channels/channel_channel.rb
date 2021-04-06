class ChannelChannel < ApplicationCable::Channel
  def subscribed
    channel = Channel.find params[:channel_id]

    reject unless ChannelUser.exists?(
      user_id: current_user.id,
      channel_id: channel.id,
    )

    stream_for channel
  end
end

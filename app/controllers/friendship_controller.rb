class FriendshipController < ApplicationController

  # GET /users/<user_id>/friends
  def get()
    load_entities(false)

    begin
      x = @user.friends[0]
      puts x
      puts x
    rescue StandardError => e
      print(e)
      print(e.instance_variables)
    end

    render({
      json: FriendshipBlueprint.render(@user.friends),
    })
  end

  # GET /users/<user_id>/friends/pending
  def pending()
    load_entities(false)

    render({
      json: FriendshipBlueprint.render(@user.pending_friends, view: :received_side),
    })
  end

  # GET /users/<user_id>/friends/requests
  def requests()
    load_entities(false)

    render({
      json: FriendshipBlueprint.render(@user.pending_requests, view: :send_side),
    })
  end

  # GET /users/<user_id>/friends/<friend_id>
  def status()
  end

  # POST /users/<user_id>/friends
  def create()
  end

  # POST /users/<user_id>/friends/<friend_id>
  def accept()
  end

  # DELETE /users/<user_id>/friends/<friend_id>
  def delete()
  end

  private

  def load_entities(with_friend = false)
    @user = User.find(params[:user_id])

    if with_friend
      @friend = User.find(params[:friend_id])

      @friendship = Friendship.find(
        user: @user,
        friend: @friend,
      )
    end
  end
end

class FriendshipUserBlueprint < Blueprinter::Base
  identifier :id

  fields :username
end

class FriendshipBlueprint < Blueprinter::Base
  fields :accepted

  view :received_side do
    association :user, blueprint: FriendshipUserBlueprint, name: "from"
  end

  view :send_side do
    association :friend, blueprint: FriendshipUserBlueprint, name: "to"
  end

  view :normal do
    include_view :received_side
    include_view :send_side
  end
end

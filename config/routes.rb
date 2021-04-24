Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  devise_for :users,
             controllers: {
               omniauth_callbacks: "users/omniauth_callbacks",
               sessions: "users/sessions",
             }

  devise_scope :user do
    delete "sign_out", :to => "devise/sessions#destroy", :as => :destroy_user_session_path
  end

  root to: "spa#index"

  scope "/api" do
    get "/users", to: "user#all"
    get "/users/current", to: "user#current"
    get "/users/:id", to: "user#show"
    get "/channels", to: "channel#all"
    post "/channels", to: "channel#create"
    get "/channels/:id", to: "channel#show"
    put "/channels/:id", to: "channel#update"
    get "/channels/:channel_id/messages", to: "channel_message#all"
    post "/channels/:channel_id/messages", to: "channel_message#create"
    get "/channels/:channel_id/members", to: "channel_user#all"
    get "/channels/:channel_id/members/:user_id", to: "channel_user#get"
    get "/achievements", to: "achievement#all"

    post "/channels/:id/join", to: "channel#join"
    post "/channels/:id/leave", to: "channel#leave"

    post "/channels/:channel_id/members", to: "channel_user#add"
    post "/channels/:id/transfer-ownership", to: "channel#transfer_ownership"

    delete "/channels/:id", to: "channel#delete"
    delete "/channels/:channel_id/messages", to: "channel_message#clear"
    delete "/channels/:channel_id/members/:user_id", to: "channel_user#remove"

    post "/channels/:id/promote/:user_id", to: "channel_user_admin#promote"
    post "/channels/:id/demote/:user_id", to: "channel_user_admin#demote"
    post "/channels/:id/ban/:user_id", to: "channel_user_ban#ban"
    post "/channels/:id/unban/:user_id", to: "channel_user_ban#unban"
    post "/channels/:id/mute/:user_id", to: "channel_user_mute#mute"
    post "/channels/:id/unmute/:user_id", to: "channel_user_mute#unmute"

    get "/search/users", to: "search#users"
    get "/search/channels", to: "search#channels"
  end
end

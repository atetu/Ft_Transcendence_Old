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

  #root controller: :chatrooms, action: :index

  scope "/social" do
    resources :chatrooms
    resources :messages
  end

  scope "/api" do
    get "/user/current", to: "user#current"
    get "/channels", to: "channel#all"
    post "/channels", to: "channel#create"
    get "/channels/:id", to: "channel#get"
    put "/channels/:id", to: "channel#edit"
    get "/channels/:channel_id/messages", to: "channel_message#all"
    post "/channels/:channel_id/messages", to: "channel_message#create"
    get "/channels/:channel_id/members", to: "channel_user#all"
  end
end

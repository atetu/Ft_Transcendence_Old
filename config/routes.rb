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
    get "/achievements", to: "achievement#all"
  end
end

Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }
  devise_scope :user do
    delete "sign_out", :to => "devise/sessions#destroy", :as => :destroy_user_session_path
  end

  root controller: :chatrooms, action: :index

  scope "/social" do
    resources :chatrooms
    resources :messages
  end
end

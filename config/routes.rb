UcoachManager::Application.routes.draw do

  resources :position_mappers

  get "welcome/index"

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" } do
    get "login", to: "devise/sessions#new", :as => :new_user_session
    get "login", to: "devise/sessions#new"
    
    post 'login', to: 'devise/sessions#create', :as => :user_session
    get 'logout', to: 'devise/sessions#destroy', :as => :destroy_user_session
  end
  
  devise_for :users, :skip => [:registrations] do
    get "registration", to: "devise/registrations#new", :as => :new_user_registration
    get "configuration", to: "devise/registrations#edit", :as => :edit_user_registration
  end
  
  devise_scope :user do
    get '/users/auth/:provider' => 'users/omniauth_callbacks#passthru'
  end

  root :to => "formations#index"

  resources :teams, :formations, :players, :calendars
  
  controller :formations do
    get 'index' => :index
    post 'create' => :create
    get 'create' => :newly_created
    get 'list' => :list
    get 'reports' => :reports
    post 'reports' => :reports
  end
  
  controller :players do
    get 'bahia_squad' => :bahia_squad
  end
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => "welcome#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end

class ActionDispatch::Routing::Mapper
  def draw routes_name
    instance_eval(File.read(Rails.root.join("config/routes/#{routes_name}.rb")))
  end
end

Rails.application.routes.draw do
  mount Ckeditor::Engine => "/ckeditor"
  devise_for :users, path: "auth",
    controllers: {sessions: "sessions", passwords: "passwords"},
    path_names: {sign_in: "login", sign_out: "logout"}
  draw :api
  draw :admin
  draw :assign_program
  root "static_pages#show"
  resources :static_pages
  resources :organizations do
    resources :programs
  end

  resources :sub_organizations

  resources :languages
end

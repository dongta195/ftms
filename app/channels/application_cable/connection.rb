module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      if cookies[:current_user_id]
        self.current_user = User.find_by id: cookies[:current_user_id]
      else
        reject_unauthorized_connection
      end
    end
  end
end

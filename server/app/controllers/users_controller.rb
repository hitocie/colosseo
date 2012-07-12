class UsersController < ApplicationController

  def show
    # FIXME: get friends from Facebook
    service = params[:service]
    case service
    when "get_my_friends"
      @users = User.find(:all)
      ret = @users.collect do |u|
       {
         :id => u.id,
         :uid => u.uid,
         :name => u.name
       }
      end.to_json
      render :json => ret 
      return
      
    end
  end
end

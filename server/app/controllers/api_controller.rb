class ApiController < ActionController::Base

  # constants
  BASE_URL = "http://localhost:3000"
  MAIN_PAGE = "#{BASE_URL}" #"#{BASE_URL}/main"

  FB_SITE_PAGE = "#{BASE_URL}/api/v1/users"
  FB_APP_ID = "342585285818702"
  FB_APP_SECRET = "8552d94ef0a37a6adc9e995cf48efc0e"

  protect_from_forgery
  
  # NOTE: The follows is workaround to use sessions. (CSRF token authenticity)
  skip_before_filter :verify_authenticity_token

  # authenticate check  
  before_filter :authenticate
  def authenticate
    if not session[:user] then
      raise "Security Error"
    end
  end

  # error handling
  rescue_from RuntimeError, :with => :handle_server_error
  
  def handle_server_error(exception = nil)
    e = {:failed => true}
    if exception then
      e[:message] = exception.message
    else
      e[:message] = "unknown error"
    end
    
    logger.info "---- ERROR ---- #{e[:message]}"
    render :json => e, :status => 404
  end
  
  
  ### common apis ###
  
  # Facebook apis
  def put_to_fb_wall(message)
    # TODO: Should remove
    return

    @user = session[:user]
    graph = Koala::Facebook::API.new(@user.token)
    graph.put_wall_post(message)
  end
  def put_to_fb_event(name, desc, start_time)
    # TODO: Should remove
    return
    
    @user = session[:user]
    graph = Koala::Facebook::API.new(@user.token)
    # TODO
    #image_path = "XXXXXXX"
    #picture = Koala::UploadableIO.new(File.open(image_path))
    params = {
      #:picture => picture,
      :name => name,
      :description => desc,
      :start_time => start_time
    }
    graph.put_object('me', 'events', params)
  end
  
  
  def date_to_string(d)
    return (d != nil ? d.strftime("%Y-%m-%d %H:%M:%S") : nil)
  end
  
  def create_user_if_not_exists(uid, name, token)
    user = User.where(:uid => uid).first
    if not user then
      user = User.new(:uid => uid, :name => name, :token => token)
    elsif token then
      user.update_attributes(:token => token)
    end
    user.save
    return user
  end
end

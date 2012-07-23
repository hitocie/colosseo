class AuthsController < ApiController

  skip_before_filter :authenticate

  def is_login
    session[:user] ? true : false
  end
  
  def index
    # auth
    if (not is_login) then
      url = "https://graph.facebook.com/oauth/authorize?client_id="
      url << FB_APP_ID << "&redirect_uri=" << FB_SITE_PAGE << "&scope=manage_pages,publish_stream,offline_access"
      redirect_to url
    else
      redirect_to MAIN_PAGE
    end
  end
  

  def show
    case params[:service]
    when "is_login"
      render :json => is_login
      
    when "logout"
      reset_session
      render :json => true
      
    else
      raise "No Services"
    end
  end
end

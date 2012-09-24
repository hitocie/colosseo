class AuthsController < ApiController

  skip_before_filter :authenticate #, :only => [:index]

  def _is_login
    p session[:user]
    session[:user] ? true : false
  end
  
  def _auth(is_mobile)
    if (not _is_login) then
      site_page = 
        if is_mobile then
          MOBILE_FB_SITE_PAGE 
        else 
          WEB_FB_SITE_PAGE 
        end
      url = "https://graph.facebook.com/oauth/authorize?client_id="
      url << FB_APP_ID << "&redirect_uri=" << site_page << "&scope=publish_stream"
#      if (is_mobile)
#         url << "&display=wap"
#      end
      redirect_to url
    else
      if is_mobile then
        redirect_to MOBILE_MAIN_PAGE
      else
        redirect_to WEB_MAIN_PAGE
      end
    end
  end
  
  # for web to authenticate
  def web
    _auth(false)
  end

  # for mobile to authenticate  
  def mobile
    _auth(true)
  end
  

  def show
    case params[:service]
    when "is_login"
      render :json => _is_login
      
    when "logout"
      reset_session
      render :json => true
      
    else
      raise "No Services"
    end
  end
end

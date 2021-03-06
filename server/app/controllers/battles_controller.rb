class BattlesController < ApiController

  # index (GET)
  def index
    service = params[:service]
    case service
    when "find_my_battles"
      user_id = session[:user][:id] 
      conditions = ["battles.user_id = ? OR participants.user_id = ?", user_id, user_id]
      @battles = Battle.find(
        :all,
        :conditions => conditions,
        :order => "date DESC",
        :offset => params[:offset],
        :limit => params[:limit],
        :include => [:user, :participants]
      )
      ret = @battles.collect do |b|
      {
        :id => b.id,
        :title => b.title,
        :status => b.status
      }
      end.to_json
      render :json => ret 
      return
      
    end
  end
  
  # show (GET + id)
  def show 
    service = params[:service]
    case service
    when "get_my_battle"
      b = Battle.find(
        params[:id], 
        :include => [:user, {:participants => [:user]}]
      )
      owner = b.user
      user_id = session[:user][:id]
      if owner.id != user_id then
        raise "You cannot access this battle!" # Not own battle.
      end

      participants = 
        b.participants.collect do |p|
          {
            :id => p.user.id,
            :uid => p.user.uid,
            :name => p.user.name
          }
        end
      ret = {
        :id => b.id,
        :title => b.title,
        :date => date_to_string(b.date),
        :description => b.description,
        :kind => b.kind,
        :result => b.result,
        :status => b.status,
        :owner => {
          :id => owner.id,
          :uid => owner.uid,
          :name => owner.name
        },
        :participants => participants
      }
      render :json => ret
      return
      
    end
  end
  
  # create (POST)
  def create
    service = params[:service]
    case service
    when "create_new_battle"
      b = params[:battle]
      p b[:result]
      Battle.transaction do
        @battle = Battle.new(
          :title => b[:title], 
          :date => b[:date],
          :description => b[:description],
          :kind => b[:kind],
          :result => b[:result],
          :status => b[:status],
          :user_id => session[:user][:id] # owner
        )
        @battle.save!
        
        participants = []
        participants << session[:user][:id] # myself
        for p in b[:participants] do
          participants << p[:uid]
        end
        users = User.where(:uid => participants)
        for u in users do
          participant = @battle.participants.build(:user_id => u.id, :battle_id => @battle.id)
          participant.save!
        end
      end
      
    end
    render :json => @battle, :status => :created, :location => @battle
  end
  
  
  # update (PUT)
  def update
    @battle = Battle.find(params[:id], :include => [:user, :participants])
    case params[:service]
    when "update_result_of_battle"
      Battle.transaction do
        b = params[:battle]
        @battle.result = b[:result]
        @battle.save!
      end
      
    end
    head :ok
  end

  # delete (DELETE)  
  def destroy
    @battle = Battle.find(params[:id])
    user_id = session[:user][:id]
    if @battle.user_id != user_id then
      raise "You cannot delete this battle!" # Not own battle.
    end
    
    case params[:service]
    when "delete_battle"
      @battle.destroy
    end

    head :ok
  end
end

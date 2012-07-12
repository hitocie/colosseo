class BattlesController < ApplicationController

  # index (GET)
  def index
    service = params[:service]
    case service
    when "find_my_battles"
      @battles = Battle.find(:all)
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
      b = Battle.find(params[:id], :include => [:user, :participants])
      owner = b.user
      ret = {
        :id => b.id,
        :title => b.title,
        :date => b.date,
        :description => b.description,
        :kind => b.kind,
        :result => b.result,
        :status => b.status,
        :owner => {
          :id => owner.id,
          :uid => owner.uid,
          :name => owner.name
        }
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
      Battle.transaction do
        @battle = Battle.new(
          :title => b[:title], 
          :date => b[:date],
          :description => b[:description],
          :kind => b[:kind],
          :result => b[:result],
          :status => b[:status],
          :user_id => 1 # FIXME: session[:user][:id] # owner
        )
        @battle.save!
        
        participants = []
        # FIXME:
        # participants << session[:user][:id] # myself
        for p in b[:participants] do
          participants << p[:uid]
        end
        users = User.where(:uid => participants)
        for u in users do
          participant = @battle.participants.build(:user_id => u, :battle_id => @battle.id)
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
end

class BattlesController < ApplicationController
  def index
    @battles = Battle.find(:all)
    ret = @battles.collect do |b|
     {
       :id => b.id,
       :title => b.title,
       :status => b.status
     }
    end.to_json
    render :json => ret 
  end
end

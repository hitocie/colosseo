class Battle < ActiveRecord::Base
  belongs_to :user
  attr_accessible :date, :description, :result, :status, :title, :type
end

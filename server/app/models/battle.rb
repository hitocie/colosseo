class Battle < ActiveRecord::Base
  belongs_to :user # owner
  has_many :participants, :dependent => :destroy
  serialize :result
  attr_accessible :date, :description, :result, :status, :title, :kind, :user_id
end

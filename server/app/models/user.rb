class User < ActiveRecord::Base
  validates :name, :presence => true
  attr_accessible :name, :token, :uid
end

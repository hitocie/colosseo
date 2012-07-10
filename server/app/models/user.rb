class User < ActiveRecord::Base
  attr_accessible :name, :token, :uid
end

class Participant < ActiveRecord::Base
  belongs_to :battle
  belongs_to :user
  # attr_accessible :title, :body
end

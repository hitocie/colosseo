# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Participant.delete_all
Battle.delete_all
User.delete_all

# reset id
ActiveRecord::Base.connection.execute('ALTER TABLE participants AUTO_INCREMENT = 1')
ActiveRecord::Base.connection.execute('ALTER TABLE battles AUTO_INCREMENT = 1')
ActiveRecord::Base.connection.execute('ALTER TABLE users AUTO_INCREMENT = 1')

# create test data
b1 = Battle.new(:title => 'battle-01', :status => 50)
b1.save!

b2 = Battle.new(:title => 'battle-02', :status => 20)
b2.save!

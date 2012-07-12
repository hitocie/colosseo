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
User.create(
  [{uid: '10001', name: 'Hitoshi Okada'}, 
   {uid: '10002', name: 'Katsushi Fukui'},
   {uid: '10003', name: 'Yohsuke Sugahara'}]
)


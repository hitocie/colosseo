# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120710135535) do

  create_table "battles", :force => true do |t|
    t.string   "title"
    t.date     "date"
    t.integer  "user_id"
    t.text     "description"
    t.integer  "kind"
    t.text     "result"
    t.integer  "status"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "battles", ["user_id"], :name => "index_battles_on_user_id"

  create_table "participants", :force => true do |t|
    t.integer  "battle_id"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "participants", ["battle_id"], :name => "index_participants_on_battle_id"
  add_index "participants", ["user_id"], :name => "index_participants_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "uid"
    t.string   "name"
    t.string   "token"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end

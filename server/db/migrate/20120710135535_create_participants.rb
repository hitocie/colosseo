class CreateParticipants < ActiveRecord::Migration
  def change
    create_table :participants do |t|
      t.references :battle
      t.references :user

      t.timestamps
    end
    add_index :participants, :battle_id
    add_index :participants, :user_id
  end
end

class CreateBattles < ActiveRecord::Migration
  def change
    create_table :battles do |t|
      t.string :title
      t.date :date
      t.references :user
      t.text :description
      t.integer :type
      t.text :result
      t.integer :status

      t.timestamps
    end
    add_index :battles, :user_id
  end
end

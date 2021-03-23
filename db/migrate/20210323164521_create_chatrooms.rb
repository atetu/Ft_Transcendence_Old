class CreateChatrooms < ActiveRecord::Migration[6.1]
  def change
    create_table :chatrooms do |t|
      t.string :name

      t.timestamps
    end
    add_index :chatrooms, :name, unique: true
  end
end

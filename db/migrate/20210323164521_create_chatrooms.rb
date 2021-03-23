class CreateChatrooms < ActiveRecord::Migration[6.1]
  def change
    create_table :chatrooms do |t|
      t.string :name, null: false
      t.integer :visibility, null: false
      t.string :slug, null: false, limit: 10
      t.string :password
      t.references :owner, null: false, foreign_key: { to_table: "users" }

      t.timestamps
    end

    add_index :chatrooms, :slug, unique: true
  end
end

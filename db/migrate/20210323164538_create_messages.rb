class CreateMessages < ActiveRecord::Migration[6.1]
  def change
    create_table :messages, id: :uuid do |t|
      t.integer :content_type, null: false
      t.string :content, null: false, limit: 200
      t.references :chatroom, null: false, type: :uuid, foreign_key: true
      t.references :user, null: false, type: :uuid, foreign_key: true
      t.text :message

      t.timestamps
    end
  end
end

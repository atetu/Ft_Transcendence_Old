class CreateGames < ActiveRecord::Migration[6.1]
  def change
    create_table :games, id: :uuid do |t|
      t.string :status
      t.references :player1, type: :uuid, references: :users
			t.references :player2, type: :uuid, references: :users
      t.timestamps
    end
  end
end

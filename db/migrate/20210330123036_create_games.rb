class CreateGames < ActiveRecord::Migration[6.1]
  def change
    create_table :games, id: :uuid do |t|
      t.integer :side
      t.integer :ball_x
      t.integer :ball_y
      t.integer :paddle1
      t.integer :paddle2
      t.references :player1, type: :uuid, references: :users
			t.references :player2, type: :uuid, references: :users
      t.timestamps
    end
  end
end

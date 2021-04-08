class CreateGames < ActiveRecord::Migration[6.1]
  def change
    create_table :games, id: :uuid do |t|
      t.string :side
      t.timestamps
    end
  end
end

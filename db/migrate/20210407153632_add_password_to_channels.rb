class AddPasswordToChannels < ActiveRecord::Migration[6.1]
  def change
    add_column :channels, :password_digest, :string, null: true
    remove_column :channels, :password
  end
end

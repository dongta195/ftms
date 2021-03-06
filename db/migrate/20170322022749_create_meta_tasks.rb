class CreateMetaTasks < ActiveRecord::Migration[5.0]
  def change
    create_table :meta_tasks do |t|
      t.string :title
      t.text :value
      t.integer :input_type
      t.integer :dynamic_task_id
      t.datetime :deleted_at

      t.timestamps
    end
  end
end

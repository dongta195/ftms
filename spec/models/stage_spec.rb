require "rails_helper"

RSpec.describe Stage, type: :model do
  describe "validation" do
    context "association" do
      it{is_expected.to have_many :profiles}

      it{is_expected.to belong_to :creator}
    end

    context "columns" do
      it{is_expected.to have_db_column(:name).of_type(:string)}
      it{is_expected.to have_db_column(:deleted_at).of_type(:datetime)}
      it{is_expected.to have_db_column(:creator_id).of_type(:integer)}
    end

    context "is valid with name" do
      stage = Stage.new name: "Resigned"
      it{expect(stage).to be_valid}
    end

    context "is invalid without name" do
      stage = Stage.new
      stage.valid?
      it{expect(stage.errors[:name]).to include("can't be blank")}
    end
  end

  describe "constant" do
    it "should have a fixed list constant" do
      expect(described_class).to have_constant :ATTRIBUTE_PARAMS
    end
  end
end

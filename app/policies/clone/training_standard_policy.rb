class Clone::TrainingStandardPolicy < ApplicationPolicy
  def create?
    is_owner_organization? && not_owner_training_standard &&
      (shared? || is_public_training_standard?)
  end

  private
  def is_owner_organization?
    record[:organization].owner == @user
  end

  def shared?
    record[:training_standard].shared_organizations.include? record[:organization].id
  end

  def not_owner_training_standard
    record[:training_standard].organization != record[:organization]
  end

  def is_public_training_standard?
    record[:training_standard].publiced?
  end
end
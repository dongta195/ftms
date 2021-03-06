class SubjectPolicy < ApplicationPolicy
  def index?
    (super && belongs_to_organization?) || is_owner_organization? || is_course_manager?
  end

  def create?
    (super && belongs_to_organization?) || is_owner_organization?
  end

  def show?
    check_owner? || check_creator_subject? ||
    (super &&
      (@user.organizations.include?(record[:subject].organization) ||
      record[:subject].organization.creator == @user ||
      is_course_manager? || is_creator_course?
      )
    )
  end

  def update?
    check_owner? || check_creator_subject || (super && has_function?)
  end

  def destroy?
    check_owner? || check_creator_subject || (super && has_function?)
  end

  private
  def is_owner_organization?
    record[:organization].owner == @user
  end

  def belongs_to_organization?
    record[:organization].users.include? @user
  end

  def has_function?
    @user.organizations.include?(record[:subject].organization) ||
      (record[:subject].organization.creator == @user) ||
      check_creator_subject?
  end

  def check_creator_subject?
    record[:subject].creator == @user
  end

  def check_owner?
    record[:subject].organization.owner == @user
  end

  def is_course_manager?
    record[:course_subject].course.user_courses.pluck(:user_id)
      .include?(@user.id) if record[:course_subject]
  end

  def is_creator_course?
    record[:course_subject].course.owner == @user if record[:course_subject]
  end
end

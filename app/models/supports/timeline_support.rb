class Supports::TimelineSupport
  def initialize args = {}
    @user = args[:user]
  end

  def assignments
    assignments = Array.new
    @user.user_subjects.each do |user_subject|
      assignments += user_subject.assignments
    end
    assignments
  end

  def user_subjects
    @user_subjects ||= @user.user_subjects
  end

  def dynamic_tasks assignment, course_subject, user
    static_task = assignment.static_tasks.find_by ownerable: course_subject
    return nil unless static_task
    @dynamic_tasks = user.dynamic_tasks.where ownerable_type: course_subject.class.name
    @dynamic_tasks.find_by targetable_id: static_task.id
  end

  def count_assignment status, course_subject, user
    user.dynamic_tasks.where(ownerable: course_subject, status: status,
      targetable_id: StaticTask.where(targetable_type: Assignment.name)).length
  end
end

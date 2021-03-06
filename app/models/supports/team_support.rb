class Supports::TeamSupport
  def initialize args = {}
    @params = args[:params]
  end

  def course_subject
    @course_subject = if team.present?
      team.course_subject
    else
      CourseSubject.find_by id: @params[:team][:course_subject_id]
    end
  end

  def team
    @team ||= Team.find_by id: @params[:id]
  end

  def subject
    @subject ||= course_subject.subject
  end

  def course
    @course ||= course_subject.course
  end

  def course_serialize
    Serializers::Courses::CoursesSerializer
      .new(object: course_subject.course).serializer
  end

  def training_standard
    @training_standard ||= course.training_standard
  end

  def evaluation_template
    return nil unless training_standard
    @evaluation_template ||= training_standard.evaluation_template
  end

  def evaluation_standards
    return Array.new unless evaluation_template
    @evaluation_standards ||= evaluation_template.evaluation_standards
  end

  def user_subjects
    @user_subjects ||= team.user_subjects.map do |user_subject|
      user_subject.attributes.merge user_name: user_subject.user.name
    end
  end

  def statuses
    @statuses ||= UserSubject.statuses
  end

  def member_evaluations
    return Array.new unless course_subject
    @member_evaluations ||=
      Serializers::Evaluations::MemberEvaluationsSerializer
        .new(object: course_subject.member_evaluations).serializer
  end

  def team_detail
    @team_detail ||= Serializers::Teams::TeamDetailsSerializer
      .new(object: team, scope: {course_subjects: course_subject,
        team_supports: self}).serializer
  end

  %w(surveys assignments test_rules projects).each do |task|
    define_method "#{task}_not_in_static_task" do
      team.course_subject.send("static_#{task}").where.not id: team.send(task)
    end
  end

  def documents
    @documents ||= team.documents
  end

  def organization
    @organization ||= team.course_subject.course.program.organization
  end

  def meta_types
    organization.meta_types
  end
end

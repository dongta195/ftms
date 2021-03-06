class Supports::TestRuleSupport
  def initialize args = {}
    @params = args[:params]
  end

  def organization
    @organization ||= Organization.find_by id: @params[:organization_id]
  end

  def course
    @course ||= Course.find_by id: @params[:course_id]
  end

  def test_rule
    @test_rule ||= TestRule.find_by id: @params[:id]
  end

  def test_rules_serializer
    Serializers::TestRules::TestRulesSerializer
      .new(object: organization.test_rules).serializer
  end

  def categories
    Serializers::Categories::CategoriesSerializer
      .new(object: Category.all).serializer
  end

  def questions
    Serializers::Categories::QuestionsSerializer
      .new(object: Question.all).serializer
  end

  def test_rule_serializer
    Serializers::TestRules::TestRulesSerializer
      .new(object: test_rule).serializer
  end
end

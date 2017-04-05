class Serializers::Organizations::OrganizationDetailSerializer <
  Serializers::SupportSerializer
  attrs :id, :name, :parent_id, :sub_organizations, :owner, :users

  def sub_organization
    Serializers::Organizations::SubOrganizationSerializer
      .new(object: object.children)
  end

  def owner
    Serializers::Users::UsersSerializer.new(object: object.owner).serializer
  end

  def users
    Serializers::Users::UsersSerializer.new(object: object.users).serializer
  end
end
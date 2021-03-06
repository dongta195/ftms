import React from 'react';
import axios from 'axios';
import ListUsers from './list_users';

import * as routes from 'config/routes';

require('../../..assets/sass/modal_assign_member.scss');

export default class ModalAssignMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unassigned_users: props.unassignedUsers,
      managers: props.managers,
      members: props.members,
      checked_users: [],
      checked_managers: [],
      checked_members: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      unassigned_users: nextProps.unassignedUsers,
      managers: nextProps.managers,
      members: nextProps.members,
      checked_users: [],
      checked_managers: [],
      checked_members: []
    });
  }

  render() {
    return (<div className="modal fade modal-assign-member" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title" id="assign-member-label">
              {I18n.t('courses.labels.assign_members')}
            </h4>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-5">
                <ListUsers title={I18n.t('courses.labels.list_users')}
                  className="list-users" users={this.state.unassigned_users}
                  checkedUsers={this.state.checked_users}
                  handleClickUser={this.handleClickUser.bind(this)} />
              </div>

              <div className="col-md-2 action-assign">
                <button className="btn btn-success center-block assign-managers"
                  onClick={this.assignManagers.bind(this)}>
                  <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                  {I18n.t('courses.labels.manager')}
                </button>
                <button className="btn btn-danger center-block reject-users"
                  onClick={this.rejectUsers.bind(this)}>
                  <i className="fa fa-angle-double-left" aria-hidden="true"></i>
                  {I18n.t('courses.labels.reject')}
                </button>
                <button className="btn btn-success center-block assign-members"
                  onClick={this.assignMembers.bind(this)}>
                  <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                  {I18n.t('courses.labels.member')}
                </button>
              </div>

              <div className="col-md-5">
                <ListUsers title={I18n.t('courses.labels.list_managers')}
                  className="list-managers" users={this.state.managers}
                  checkedUsers={this.state.checked_managers}
                  handleClickUser={this.handleClickManager.bind(this)} />
                <ListUsers title={I18n.t('courses.labels.list_members')}
                  className="list-members" users={this.state.members}
                  checkedUsers={this.state.checked_members}
                  handleClickUser={this.handleClickMember.bind(this)} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">
              {I18n.t('buttons.cancel')}
            </button>
            <button type="button" className="btn btn-primary"
              onClick={this.handleSubmit.bind(this)}>
              {I18n.t('buttons.save')}
            </button>
          </div>
        </div>
      </div>
    </div>);
  }

  handleClickUser(user, checked) {
    if(checked) {
      _.remove(this.state.checked_users, checked_user => {
        return checked_user.id == user.id;
      });
    } else {
      this.state.checked_users.push(user);
    }
    this.setState({checked_users: this.state.checked_users});
  }

  handleClickManager(user, checked) {
    if(checked) {
      _.remove(this.state.checked_managers, checked_user => {
        return checked_user.id == user.id;
      });
    } else {
      this.state.checked_managers.push(user);
    }
    this.setState({checked_managers: this.state.checked_managers});
  }

  handleClickMember(user, checked) {
    if(checked) {
      _.remove(this.state.checked_members, checked_user => {
        return checked_user.id == user.id;
      });
    } else {
      this.state.checked_members.push(user);
    }
    this.setState({checked_members: this.state.checked_members});
  }

  assignManagers() {
    let managers = this.state.managers.concat(this.state.checked_users);
    let unassigned_users = this.state.unassigned_users.filter(_user => {
      return this.state.checked_users.indexOf(_user) < 0;
    });
    this.setState({
      checked_users: [],
      managers: managers,
      unassigned_users: unassigned_users
    });
  }

  rejectUsers() {
    let unassigned_users = this.state.unassigned_users
      .concat(this.state.checked_managers, this.state.checked_members);
    let managers = this.state.managers.filter(_user => {
      return this.state.checked_managers.indexOf(_user) < 0;
    });
    let members = this.state.members.filter(_user => {
      return this.state.checked_members.indexOf(_user) < 0;
    });
    this.setState({
      checked_members: [],
      checked_managers: [],
      unassigned_users: unassigned_users,
      managers: managers,
      members: members
    });
  }

  assignMembers() {
    let members = this.state.members.concat(this.state.checked_users);
    let unassigned_users = this.state.unassigned_users.filter(_user => {
      return this.state.checked_users.indexOf(_user) < 0;
    });
    this.setState({
      checked_users: [],
      members: members,
      unassigned_users: unassigned_users
    });
  }

  handleSubmit() {
    let formData = new FormData();
    let index = 0;
    for(let user of this.state.unassigned_users) {
      if(user.user_course) {
        formData.append('course[user_courses_attributes][' + index + '][id]',
          user.user_course.id);
        formData.append('course[user_courses_attributes][' + index +
          '][user_id]', user.id);
        formData.append('course[user_courses_attributes][' + index +
          '][type]', user.user_course.type);
        formData.append('course[user_courses_attributes][' + index +
          '][_destroy]', true);
        index++;
      }
    }

    for(let user of this.state.managers) {
      if(user.user_course) {
        formData.append('course[user_courses_attributes][' + index + '][id]',
          user.user_course.id);
      }
      formData.append('course[user_courses_attributes][' + index +
        '][user_id]', user.id);
      formData.append('course[user_courses_attributes][' + index +
        '][type]', 'CourseManager');
      index++;
    }

    for(let user of this.state.members) {
      if(user.user_course) {
        formData.append('course[user_courses_attributes][' + index + '][id]',
          user.user_course.id);
      }
      formData.append('course[user_courses_attributes][' + index +
        '][user_id]', user.id);
      formData.append('course[user_courses_attributes][' + index +
        '][type]', 'CourseMember');
      index++;
    }

    formData.append('authenticity_token', ReactOnRails.authenticityToken());

    let assign_user_course_url = routes.assign_user_courses_url(
      this.props.course.id) + '.json';
    axios.patch(assign_user_course_url, formData)
      .then(response => {
        this.props.afterAssignUsers(response.data.course.unassigned_users,
          response.data.course.managers, response.data.course.members);
        $('.modal-assign-member').modal('hide');
      })
      .catch(error => console.log(error));
  }
}

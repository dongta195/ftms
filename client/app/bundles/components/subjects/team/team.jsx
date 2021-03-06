import * as routes from 'config/routes';
import axios from 'axios';
import ButtonChangeStatuses from '../actions/user_subjects/change_statuses';
import React from 'react';

export default class Team extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: props.team,
      user_subjects: props.user_subjects,
      statuses: props.statuses,
      user_id: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      team: nextProps.team,
      user_subjects: nextProps.user_subjects
    });
  }

  renderTeamMembers(){
    return this.state.user_subjects.map((user_subject, index) => {
      let statusClass = 'fa fa-circle fa-1 ' + user_subject.status.replace('_', '-');
      return (
        <tr key={index} className='team-user-subject-item'>
          <td>
            <span className='user-subject-status'>
              <i className={statusClass}></i>
            </span>
            {user_subject.user_name}
          </td>
          <td>
            {user_subject.start_date}
          </td>
          <td>
            {user_subject.end_date}
          </td>
        </tr>
      );
    });
  }

  render() {
    let team_url = routes.team_url(this.props.team.id);

    const DisplayButton = () => {
      let not_finished = this.state.user_subjects.
        findIndex(user_subject => user_subject.status != 'finished');

      let not_started = this.state.user_subjects.
        findIndex(user_subject => user_subject.status != 'init');

      if ((not_finished > -1) && (not_started > -1)) {
        return (
          <ButtonChangeStatuses
            course={this.props.course}
            object_type="Team"
            object_id={this.state.team.id}
            course_subject={this.props.course_subject} />
        );
      } else {
        return null;
      }
    }

    return (
      <div className='team'>
        <a href={team_url}>
          <h2>
            <i className='fa fa-fw fa-star'></i>
            <strong>{this.state.team.name}</strong>
          </h2>
        </a>
        <div className='team-content'>
          <DisplayButton />
          <div className='table-responsive'>
            <table className='table table-condensed member-table'>
              <thead>
                <tr>
                  <th>{I18n.t('subjects.team_member.name')}</th>
                  <th>{I18n.t('subjects.team_member.start_date')}</th>
                  <th>{I18n.t('subjects.team_member.end_date')}</th>
                </tr>
              </thead>
              <tbody>
                {this.renderTeamMembers()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

import BasicForm from './templates/forms_box_partials/basic_form';
import FullForm from './templates/forms_box_partials/full_form';
import React from 'react';
import * as routes from 'config/routes';

require('../../assets/sass/user.scss');

export default class UserFormsBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    let title = '';
    let profile = null;
    let current_user = JSON.parse(localStorage.current_user);
    let form = <FullForm program={this.props.program}
        url={routes.organization_users_url(this.props.organization.id)}
        organization={this.props.organization}
        universities={this.props.universities}
        trainee_types={this.props.trainee_types}
        trainers={this.props.trainers} user={this.props.user}
        stage={this.props.stage} profile={this.props.profile}
        organization_programs={this.props.organization_programs}
        languages={this.props.languages} stages={this.props.stages}
        user_statuses={this.props.user_statuses}
      />;

    if (this.props.user) {
      title = I18n.t('users.box_title.edit_info') + ': ' + this.props.user.name;
      if (this.props.user.id == current_user.id) {
        form = <BasicForm universities={this.props.universities}
          user={this.props.user} profile={this.props.profile}
          url={routes.organization_users_url(this.props.organization.id)}
          organization={this.props.organization}
        />;
      }
    } else {
      title = I18n.t('users.box_title.new_user');
    }

    return(
      <div className='row'>
        <div className='col-md-12'>
          <div className='box box-success'>

            <div className='box-header with-border'>
              <h3 className='box-title'>{title}</h3>
              <div className='box-tools pull-right'>
                <button type='button' className='btn btn-box-tool'
                  data-widget='collapse'>
                  <i className='fa fa-minus'></i>
                </button>
                <button type='button' className='btn btn-box-tool'
                  data-widget='remove'>
                  <i className='fa fa-times'></i>
                </button>
              </div>
            </div>

            <div className='box-body no-padding row'>
              {form}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

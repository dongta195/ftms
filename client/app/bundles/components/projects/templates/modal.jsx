import Form from './form';
import React from 'react';
import * as routes from 'config/routes';

export default class Modal extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      project: {},
    }
  }

  render() {
    let projects_url = routes.projects_url();
    return (
      <div className='modal-create modal fade in' role='dialog'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' data-dismiss='modal'>
                &times;
              </button>
              <h4 className='modal-title'>
                {I18n.t('projects.modals.manage_project')}
              </h4>
            </div>
            <div className='modal-body clearfix'>
              <Form organizations={this.props.organizations}
                url={projects_url} project={this.state.project}
                team={this.props.team}
                handleAfterUpdate={this.props.handleAfterUpdate}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

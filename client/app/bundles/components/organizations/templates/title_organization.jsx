import axios from 'axios';
import FormOrganization from './organization_form';
import React from 'react';
import * as routes from 'config/routes';
import OrganizationPolicy from 'policy/organization_policy';

require('../assets/organization.scss');

export default class TitleOrganization extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      organization: this.props.organization
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      organization: nextProps.organization
    });
  }

  render() {
    return(
      <div className="organization">
        <div className="name-organization">
          <p>{this.state.organization.name}</p>
        </div>
        <div className="function">
          <OrganizationPolicy
            permit={[
              {action: ['ownerById'], data: {id: this.state.organization.user_id}},
              {action: ['update', 'creator'], data: this.state.organization},
              {action: ['update', 'belongById'],
                data: {key: 'organization_id', id: this.state.organization.id}},
          ]}>
            <i className="fa fa-pencil"
              onClick={this.handleClickEdit.bind(this)}/>
          </OrganizationPolicy>
        </div>
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
        {this.renderModalEditOrganization(this.state.organization)}
      </div>
    )
  }

  renderModalEditOrganization(organization) {
    return(
      <div id='modal' className='modalEditOrganization modal fade in' 
        role='dialog'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close'
                data-dismiss='modal'>&times;</button>
              <h4 className='modal-title'>
                {I18n.t('organizations.update',
                  {name: this.state.organization.name})}
              </h4>
            </div>
            <div className='modal-body'>
              <FormOrganization
                organization={this.state.organization}
                url={routes.organization_url(organization.id)}
                handleAfterUpdated={this.props.handleAfterUpdated}
                />
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleClickEdit() {
    $('.modalEditOrganization').modal();
  }

  afterSave(organization) {
    this.setState({
      organization: organization
    })
  }
}

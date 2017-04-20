import axios from 'axios';
import React from 'react';

export default class OrganizationPanelInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organizations: props.organizations
    };
  }

  render() {
    let count_organizations = this.state.organizations.length;
    let count_programs = 0;
    let count_training_standards = 0;
    let count_courses = 0;

    for(let organization of this.state.organizations) {
      if(organization.programs){
        count_programs += organization.programs.length;
        for(let program of organization.programs){
          if(program.courses){
            count_courses += program.courses.length;
          }
          if(program.training_standards){
            count_training_standards += program.training_standards.length;
          }
        }
      }
    }
    return (
      <div>
        <div className='box box-primary'>
          <div className='box-header with-border'>
            <h3 className='box-title'>
              <strong>{I18n.t('organizations.titles.info')}</strong>
            </h3>
          </div>
          <div className='box-body'>
            <div>
              <div className='member-title'>
                <i className='fa fa-users' aria-hidden='true'></i>
                <strong>
                  {I18n.t('organizations.num_organizations')}
                </strong>
                <span className='badge label-primary'>
                  {count_organizations}
                </span>
              </div>
              <br />
              <div className='member-title'>
                <i className='fa fa-graduation-cap' aria-hidden='true'></i>
                <strong>
                  {I18n.t('organizations.num_programs')}
                </strong>
                <span className='badge label-primary'>{count_programs}</span>
              </div>
              <br />
              <div className='member-title'>
                <i className='fa fa-certificate' aria-hidden='true'></i>
                <strong>
                  {I18n.t('organizations.num_training_standards')}
                </strong>
                <span className='badge label-primary'>
                  {count_training_standards}
                </span>
              </div>
              <br />
              <div className='member-title'>
                <i className='fa fa-book' aria-hidden='true'></i>
                <strong>
                  {I18n.t('organizations.num_courses')}
                </strong>
                <span className='badge label-primary'>{count_courses}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

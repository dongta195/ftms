import axios from 'axios';
import ModalCreateSubject from './subject_form/modal_create_subject';
import React from 'react';
import SubjectPolicy from 'policy/subject_policy';
import Subjects from './subjects';

export default class SubjectBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subjects: props.subjects,
      subject: {}
    };
  }

  render() {
    return (
      <div className='row subjects admin-subjects'>
        <div className='col-md-12'>
          <div className='box box-success'>
            <div className='box-header with-border'>
              <h3 className='box-title'>{I18n.t('subjects.titles.all')}</h3>

              <div className="box-tools pull-right">
                <button type="button" className="btn btn-box-tool" data-widget="collapse">
                  <i className="fa fa-minus"></i>
                </button>
                <button type="button" className="btn btn-box-tool" data-widget="remove">
                  <i className="fa fa-times"></i>
                </button>
              </div>
            </div>

            <div className='box-body no-padding'>
              <div className='row'>
                <div className='col-md-8'>
                  <SubjectPolicy
                    permit={[
                      {action: ['ownerById'], data: {id: this.props.organization.user_id}},
                      {action: ['create'], target: 'children'}
                    ]} >
                    <button type="button" className="btn btn-info create-subject"
                      onClick={this.handleCreateSubject.bind(this)}>
                      <i className="fa fa-plus"></i> {I18n.t('subjects.buttons.create')}
                    </button>
                  </SubjectPolicy>
                </div>
                <ModalCreateSubject subject={this.state.subject}
                  organization={this.props.organization}
                  handleAfterCreated={this.handleAfterCreated.bind(this)} />
              </div>
            </div>

            <div className='box-footer'>
              <SubjectPolicy
                  permit={[
                    {action: ['ownerById'], data: {id: this.props.organization.user_id}},
                    {action: ['create'], target: 'children'},
                    {action: ['index'], target: 'children'},
                  ]}>
                <Subjects subjects={this.state.subjects}
                  organization={this.props.organization}
                  handleAfterUpdated={this.handleAfterUpdated.bind(this)}
                  handleAfterDeleted={this.handleAfterDeleted.bind(this)} />
              </SubjectPolicy>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleAfterCreated(subject) {
    this.state.subjects.push(subject);
    this.setState({
      subjects: this.state.subjects,
      subject: {}
    });
  }

  handleAfterUpdated(new_subject) {
    let index = this.state.subjects
      .findIndex(subject => subject.id === new_subject.id);
    this.state.subjects[index] = new_subject;
    this.setState({
      subjects: this.state.subjects,
      subject: {}
    });
  }

  handleAfterDeleted(deleted_subject) {
    _.remove(this.state.subjects,
      subject => subject.id === deleted_subject.id);
    this.setState({subjects: this.state.subjects});
  }

  handleCreateSubject() {
    this.setState({
      subject: {},
    });
    $('.modal-create-subject').modal();
  }
}

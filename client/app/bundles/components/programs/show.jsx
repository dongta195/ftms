import React from 'react';
import axios from 'axios';
import ReactOnRails from 'react-on-rails';
import Modal from './templates/modal_course';
import Errors from '../shareds/errors';
import ModalPreviewDocument from '../shareds/modal_preview_document';
import ModalCreateStandard from './templates/modal_create_standard';
import Dropzone from 'react-dropzone';
import UserLists from './user_lists';
import SubjectLists from './subjects';
import Documents from './templates/documents';
import ProgramInfo from './templates/program_info';
import FilterTrainingStandard from './templates/filter_training_standards';
import ProgramRightPanel from './templates/program_right_panel';
import RenderListCourse from './templates/render_list_course_of_program';

import * as app_constants from 'constants/app_constants';
import * as program_constants from './constants/program_constants';
import * as user_constants from '../users/user_constants';
import * as course_constants from '../courses/constants/course_constants';

require('../../assets/sass/program_show.scss');

const PROGRAM_URL = app_constants.APP_NAME + program_constants.ORGANIZATION_PATH;
const STANDARD_URL = app_constants.APP_NAME + program_constants.TRANINING_STANDARD_PATH;
const ASSIGN_STANDARD_URL = app_constants.APP_NAME + program_constants.ASSIGN_STANDARD_PATH;
const COURSE_URL = app_constants.APP_NAME + program_constants.PROGRAMS_PATH;
const DEFAULT_IMAGE_COURSE = app_constants.DEFAULT_IMAGE_COURSE_URL;
const LIMIT_DESCRIPTION = app_constants.LIMIT_DESCRIPTION;

export default class ProgramsShowBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_roles: props.all_roles,
      owners: props.owners,
      organization: props.program_detail.organization,
      program_detail: props.program_detail,
      training_standards: props.program_detail.training_standards,
      image: '',
      selected_standard: 0,
      course: {},
      errors: null,
      documents: props.program_detail.documents,
      document_preview: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      courses: nextProps.courses,
      program_detail: nextProps.program_detail,
      organization: nextProps.organization,
     });
  }

  renderUser(user) {
    let user_path = app_constants.APP_NAME + user_constants.USER_PATH + user.id;
    return (
     <li key={user.id}>
       <a href={user_path} title={user.name}>
         <img className='img-circle' src={user.avatar.url} width='20' height='20'/>
       </a>
     </li>
    );
  }

  render() {
    let url_programs = PROGRAM_URL + '/' + this.props.organization.id + '/' +
    program_constants.PROGRAMS_PATH + this.props.program.id;
    let modalEdit = (
      <Modal
        program_detail={this.state.program_detail}
        url={COURSE_URL + this.props.program.id +'/courses'}
        image={this.state.image}
        program={this.props.program}
        all_roles={this.state.all_roles}
        owners={this.state.owners}
        course={this.state.course}
        url_programs={url_programs} />
    );

    return (
      <div className='clearfix'>
        <div className='col-md-9'>

          <div className='margin-select row'>
            <ProgramInfo
              program_detail={this.state.program_detail}
              organization={this.state.organization}
              owners={this.state.owners}
            />
            <FilterTrainingStandard
              training_standards={this.state.training_standards}
              handleAfterClickCreateCourse={this.handleAfterClickCreateCourse.bind(this)}
              handleAfterSelectTrainingStandard={this.handleAfterSelectTrainingStandard.bind(this)}
            />
          </div>

          <RenderListCourse
            course_url={COURSE_URL}
            course_path={course_constants.COURSES_PATH}
            program={this.props.program}
            program_detail={this.state.program_detail}
            selected_standard={this.state.selected_standard}
          />
        </div>

        <ProgramRightPanel
          program_detail={this.state.program_detail}
        />

        <Documents
          documents={this.state.documents}
          program_detail={this.state.program_detail}
          handlerAfterClickPreviewDocument={this.handlerAfterClickPreviewDocument.bind(this)}
          handleDocumentUploaded={this.handleDocumentUploaded.bind(this)}
        />

        <ModalPreviewDocument
          document_preview={this.state.document_preview}
          handleDocumentDeleted={this.handleDocumentDeleted.bind(this)}
        />

        <ModalCreateStandard
          assign_standard_url={ASSIGN_STANDARD_URL}
          standard_url={STANDARD_URL}
          program={this.props.program}
          handleAfterCreatedStandard={this.handleAfterCreatedStandard.bind(this)}
        />

        {modalEdit}
      </div>
    );
  }

  handleAfterCreatedStandard(training_standard) {
    this.state.training_standards.push(training_standard);
    this.setState({
      training_standards: this.state.training_standards
    });
  }

  handleAfterClickCreateCourse() {
    this.setState({
      course: {}
    })
  }

  handleAfterSelectTrainingStandard(training_standard) {
    this.setState({
      selected_standard: training_standard
    });
  }

  handleAfterUpdate(new_course){
    let index = this.state.program_detail.courses
      .findIndex(course => course.id === new_course.id);
    this.state.program_detail.courses[index] = new_course;
    this.setState({
      program_detail: this.state.program_detail,
      course: {},
    });
  }

  handleDocumentUploaded(document) {
    this.state.documents.push(document);
    this.setState({documents: this.state.documents});
  }

  handleDocumentDeleted(document) {
    this.setState({
      documents: this.state.documents.filter(item => item.id != document.id)
    });
  }

  handlerAfterClickPreviewDocument(document) {
    this.setState({document_preview: document});
    $('.modal-preview-document').modal();
  }
}
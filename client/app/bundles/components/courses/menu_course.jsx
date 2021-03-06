import axios from 'axios';
import CoursePolicy from 'policy/course_policy';
import Dropzone from 'react-dropzone';
import FormEdit from './form_edit';
import React from 'react'
import ReactOnRails from 'react-on-rails';
import * as app_constants from 'constants/app_constants';
import * as routes from 'config/routes';

const APP_URL = app_constants.APP_NAME;

export default class MenuCourse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      course: props.course,
      url: props.url,
    };
  }
  render() {
    return(
      <div className='td-course-edit-delete pull-right hidden'>
        {this.renderButtonFinish()}
        {this.renderButtonStart()}
        <div className='td-course-edit-delete pull-right hidden'>
          <a onClick={this.handleEdit.bind(this)}
            title={I18n.t('courses.edit')}>
            <span className='btn glyphicon glyphicon-edit'
              aria-hidden='true'>
            </span>
          </a>
          <a onClick={this.handleDelete.bind(this)}
            title={I18n.t('courses.delete')}>
            <span className='btn glyphicon glyphicon-trash'
              aria-hidden='true'>
            </span>
          </a>
          <FormEdit course={this.state.course}
            url={this.state.url}
            handleAfterUpdate={this.handleAfterEdit.bind(this)} />
        </div>
      </div>
    );
  }

  onClickMenuCourse(event) {
    let target = event.target;
    if ($(target).closest('div').find('.list-item-of-course')
      .hasClass('hidden-item')) {
      $(target).closest('div').find('.list-item-of-course')
        .removeClass('hidden-item');
    } else {
      $(target).closest('div').find('.list-item-of-course')
        .addClass('hidden-item');
    }
  }

  handleAfterEdit(course) {
    this.props.handleAfterEdit(course);
  }

  handleDelete(event) {
    let course = event;
    if (confirm(I18n.t('data.confirm_delete'))) {
      axios.delete(this.state.url, {
        params: {
          authenticity_token: ReactOnRails.authenticityToken()
        },
        headers: {'Accept': 'application/json'}
      })
      .then(response => {
        var path = window.location.pathname;
        path = path.match(/[^\s|0-9]+[^\0-9]/g).join([]);
        var program_courses_path = '/' + app_constants.PROGRAMS_PATH + '/' +
          app_constants.MY_COURSES_PATH;
        if (path == program_courses_path) {
          window.location.href = routes.organization_program_url(
            response.data.program.organization_id, response.data.program.id);
        } else {
          window.location.href = app_constants.APP_NAME +
            path.substr(1, path.length - 1);
        }
      })
      .catch(error => this.setState({errors: error.response.data.errors}));
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      course: nextProps.course,
      url: nextProps.url
    });
  }

  handleEdit(event){
    $('.modalEdit').modal();
  }

  renderButtonFinish() {
    if (this.state.course.status == 'in_progress') {
      return (
        <button className='btn btn-danger finish-course'
          onClick={this.changeStatus.bind(this, 'finished')} >
          {I18n.t('courses.buttons.finish')}
        </button>
      )
    }
  }

  renderButtonStart() {
    if (this.state.course.status == 'init') {
      return (
        <button className='btn btn-success start-course'
          onClick={this.changeStatus.bind(this, 'in_progress')} >
          {I18n.t('courses.buttons.start')}
        </button>
      )
    }
  }

  changeStatus(new_status) {
    if (confirm(I18n.t('data.confirm_all'))) {
      axios.patch(routes.program_course_url(this.props.program.id,
        this.state.course.id), {
          status: new_status,
          authenticity_token: ReactOnRails.authenticityToken(),
      }, app_constants.AXIOS_CONFIG)
      .then(response => {
        this.state.course.status = response.data.course.status;
        this.setState({
          course: this.state.course
        })
        this.props.handleAfterChangeStatus(this.state.course);
      })
      .catch(error => {
        console.log(error)
      })
    }
  }

}

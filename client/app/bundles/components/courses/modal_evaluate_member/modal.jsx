import React from 'react';
import axios from 'axios';

import ResultBox from './result_box';
import * as routes from 'config/routes';
import Header from './header';

require('../../../assets/sass/modal_evaluate_member.scss');

export default class ModalEvaluateMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      evaluation_standards: props.evaluation_standards,
      evaluation_template: props.evaluation_template,
      member_evaluations: props.member_evaluations,
      member_evaluation: {},
      member_evaluation_items: [],
      course: props.course,
      user: props.user,
      standard_points: {},
      total_point: 0,
      training_result: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    let current_user = JSON.parse(localStorage.current_user);
    let member_evaluation = nextProps.member_evaluations.find(evaluation => {
      return (evaluation.member_id == nextProps.user.id) &&
        (evaluation.manager_id == current_user.id);
    }) || {};

    let total_point = 0;
    let standard_points = {};
    if (member_evaluation.id) {
      for (let standard of member_evaluation.member_evaluation_items) {
        Object.assign(standard_points,
          {[standard.evaluation_standard_id]: standard.evaluation_point});
        total_point += parseInt(standard.evaluation_point);
      }
    }

    let failed = false;
    let evaluation_standards = nextProps.evaluation_standards
    let training_result = this.getStandard(standard_points, evaluation_standards,
      total_point, failed);
    this.setState({
      evaluation_standards: nextProps.evaluation_standards,
      evaluation_template: nextProps.evaluation_template,
      member_evaluation: member_evaluation,
      user: nextProps.user,
      course: nextProps.course,
      training_result: training_result,
      standard_points: standard_points,
      total_point: total_point,
    });
  }

  renderEvaluationStandards() {
    return this.state.evaluation_standards.map((evaluation_standard, index) => {
      let obligatory = '';
      if (evaluation_standard.obligatory) {
        obligatory = (
          <i className='fa fa-check obligatory'></i>
        )
      }
      return(
        <li className='list-group-item' key={evaluation_standard.id}>
          <div className='row'>
            <div className='col-md-3'>
              <label>{index + 1}. {evaluation_standard.name}</label>
            </div>
            <div className='col-md-2'>
              <label className='min-point'
                data-point={evaluation_standard.min_point}>
                {evaluation_standard.min_point}
              </label>
            </div>
            <div className='col-md-2'>
              <label className='max-point'
                data-point={evaluation_standard.max_point}>
                {evaluation_standard.max_point}
              </label>
            </div>
            <div className='col-md-3 text-right point-input'>
              <input className='text-right' type='number' step='1' min='0'
                data-max={evaluation_standard.max_point}
                data-index={index}
                value={this.state.standard_points[evaluation_standard.id] || 0}
                onChange={this.handlePointChange.bind(this, evaluation_standard.id)} />
            </div>
            <div className='col-md-2 obligatory'>
              {obligatory}
            </div>
          </div>
        </li>
      )
    });
  }

  render() {
    let certificate_btn = '';
    if (!this.props.subject) {
      certificate_btn =  <button type='button' className='btn btn-primary'
        onClick={this.handleSubmit.bind(this, 'create_certificate')}
        disabled={!this.formValid()}>
        {I18n.t('buttons.create_certificate')}
      </button>;
    }
    return (
      <div className='modal fade modal-evaluate-member' role='dialog'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' data-dismiss='modal'>
                <span aria-hidden='true'>&times;</span>
              </button>
              <h4 className='modal-title'>{this.state.user.name}</h4>
            </div>
            <div className='modal-body'>
              <div className='row'>
                <div className='col-md-12 course-info'>
                  {I18n.t('courses.evaluation.modal_course')}:&nbsp;&nbsp;
                  <strong>{this.state.course.name}</strong>
                </div>

                <div className='col-md-12 action-assign'>
                  <ul className='list-group'>
                    <Header />
                    {this.renderEvaluationStandards()}
                    <ResultBox total_point={this.state.total_point}
                      training_result={this.state.training_result}
                      evaluation_template={this.state.evaluation_template}/>
                  </ul>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-dismiss='modal'>
                {I18n.t('buttons.cancel')}
              </button>
              <button type='button' className='btn btn-primary'
                onClick={this.handleSubmit.bind(this)}
                disabled={!this.formValid()}>
                {I18n.t('buttons.save')}
              </button>
              {certificate_btn}
            </div>
          </div>
        </div>
      </div>
    );
  }

  formValid() {
    for (let evaluation_standard of this.state.evaluation_standards) {
      let point = this.state.standard_points[evaluation_standard.id];
      if(!point) {
        return false;
      }
      if (point > parseInt(evaluation_standard.max_point)) {
        return false
      }
    }
    return true;
  }

  handlePointChange(evaluation_standard_id, event) {
    let failed = false;
    let max = parseInt($(event.target).data('max')) ;
    let value = parseInt(event.target.value);
    if (value > max) {
      event.target.value = max;
    }
    let standard_points = this.state.standard_points
    standard_points[evaluation_standard_id] = parseInt(event.target.value || 0);
    let total_point = 0;
    for (let key of Object.keys(standard_points)) {
      total_point += standard_points[key];
    }
    let evaluation_standards = this.state.evaluation_standards
    let training_result = this.getStandard(standard_points, evaluation_standards,
      total_point, failed);

    this.setState({
      training_result: training_result,
      total_point: total_point,
      standard_points: standard_points,
    });
  }

  getStandard(standard_points, evaluation_standards,
    total_point, failed) {
    if (this.props.subject) return '';
    let training_result = {};
    for (let i in evaluation_standards) {
      if (!this.props.subject) {
        if (evaluation_standards[i].obligatory) {
          let id = evaluation_standards[i].id;
          if (standard_points[id] < evaluation_standards[i].min_point) {
            failed = true;
            training_result = {id: 1, name: "Failed"};
          }
        }
      }
    }

    if (!failed) {
      training_result = this.props.evaluation_template.training_results
        .find(result => {
          return total_point >= result.min_point &&
            total_point <= result.max_point
        }
      ) || {};
    }
    return training_result;
  }

  handleSubmit(submit_type, event) {
    event.preventDefault();
    let method = '';
    let evaluation_id = '';
    if (this.state.member_evaluation.id) {
      method = 'PATCH';
      evaluation_id = this.state.member_evaluation.id
    } else {
      method = 'POST';
    }
    let formData = new FormData();
    let standard_points = this.state.standard_points;
    formData.append('submit_type', submit_type);
    if (this.props.subject) {
      formData.append('subject_id', this.props.subject.id);
    }
    formData.append('course_id', this.state.course.id);
    formData.append('member_evaluation[member_id]', this.state.user.id);
    formData.append('member_evaluation[total_point]', this.state.total_point);
    formData.append('member_evaluation[evaluation_template_id]',
      this.state.evaluation_template.id);

    let index = 0;
    for (let key of Object.keys(standard_points)) {
      if (this.state.member_evaluation.id) {
        let item = this.state.member_evaluation.member_evaluation_items.find(_item => {
          return _item.evaluation_standard_id == key;
        });
        if (item) {
          formData.append('member_evaluation[member_evaluation_items_attributes]'+
            '[' + index + '][id]', item.id);
        }
      }
      formData.append('member_evaluation[member_evaluation_items_attributes]'+
        '[' + index + '][evaluation_standard_id]', key);
      formData.append('member_evaluation[member_evaluation_items_attributes]'+
        '[' + index + '][evaluation_point]', standard_points[key]);
      index++;
    }
    if (submit_type == 'create_certificate') {
      formData.append('certificate[total_point]', this.state.total_point);
      formData.append('certificate[course_id]', this.state.course.id);
      formData.append('certificate[program_id]', this.state.course.program.id);
      formData.append('certificate[user_id]', this.state.user.id);
      formData.append('certificate[training_result_id]',
        this.state.training_result.id);
      formData.append('certificate[training_standard_id]',
        this.state.course.training_standard.id);
    }

    formData.append('authenticity_token', ReactOnRails.authenticityToken());

    let url = routes.member_evaluation_url(this.props.course.id, evaluation_id);
    axios({
      url: url,
      method: method,
      data: formData,
      headers: {'Accept': 'application/json'}
    })
    .then(response => {
      this.props.afterEvaluateMember(response.data.member_evaluation,
        response.data.member_evaluation_items, response.data.certificate);
      $('.modal-evaluate-member').modal('hide');
    })
    .catch(error => console.log(error));
  }
}

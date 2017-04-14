import React from 'react';
import ReactOnRails from 'react-on-rails';
import axios from 'axios';
import Errors from '../shareds/errors';
import * as app_constants from 'constants/app_constants';

export default class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user || {
        name: '', email: '', trainer_id: ''
      },
      profile: props.profile || {
        start_training_date: '', leave_date: '', finish_training_date: '',
        ready_for_project: 'false', contract_date: '', naitei_company: '',
        university_id: '', graduation: '', language_id: '', trainee_type_id: '',
        user_status_id: '', working_day: '', program_id: '', staff_code: '',
        division: '', join_div_date: ''
      },
      errors: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user: this.state.user,
      profile: this.state.profile,
      errors: null,
    });
  }

  renderOptions(objects) {
    if (objects) {
      return objects.map(object => {
        return <option key={object.id}
          value={object.id}>{object.name}</option>;
      });
    }
    return null;
  }

  render() {
    let check_new_user = false;
    if(this.state.user) {
      check_new_user = true;
    }
    return(
      <form role='form' onSubmit={this.handleSubmit.bind(this)}>
        <Errors errors={this.state.errors} />

        <div className='col-md-12'>
          <div className='box clearfix'>
            <div className='col-md-4'>
              <div className='form-group'>
                <label htmlFor='name'>
                  {I18n.t('users.name')}
                </label>
                <div className='input-group'>
                  <span className='input-group-addon'>
                    <i className='fa fa-user'></i>
                  </span>
                  <input id='name' className='form-control' type='text' name='name'
                    value={this.state.user.name}
                    onChange={this.handleUserChange.bind(this)}/>
                </div>
              </div>
              <div className='form-group'>
                <label htmlFor='program'>
                  {I18n.t('users.profile_detail.program')}
                </label>
                <select id='program' className='form-control'
                  name='program_id'
                  value={this.state.profile.program_id}
                  onChange={this.handleProfileChange.bind(this)}>
                  <option value=''>-- {I18n.t('users.form_select.select_program')}</option>
                  {this.renderOptions(this.props.organization_programs)}
                </select>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group'>
                <label htmlFor='email'>
                  {I18n.t('users.email')}
                </label>
                <div className='input-group'>
                  <span className='input-group-addon'>
                    <i className='fa fa-envelope'></i>
                  </span>
                  <input id='email' className='form-control' type='email'
                    name='email' onChange={this.handleUserChange.bind(this)}
                    value={this.state.user.email}/>
                </div>
              </div>
              <div className='form-group'>
                <label htmlFor='password'>
                  {I18n.t('users.profile_detail.password')}
                </label>
                <input id='password' className='form-control' type='password'
                  name='password' onChange={this.handleUserChange.bind(this)}
                  disabled={check_new_user}/>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='form-group'>
                <label>{I18n.t('users.profile_detail.trainer')}</label>
                <select className='form-control' name='trainer_id'
                  onChange={this.handleUserChange.bind(this)}
                  value={this.state.user.trainer_id}>
                  <option value=''>-- {I18n.t('users.form_select.select_trainer')}</option>
                  {this.renderOptions(this.props.trainers)}
                </select>
              </div>
              <div className='form-group'>
                <label htmlFor='password-confirmation'>
                  {I18n.t('users.profile_detail.password_confirmation')}
                </label>
                <input id='password-confirmation' className='form-control' type='password'
                  name='password_confirmation' onChange={this.handleUserChange.bind(this)}
                  disabled={check_new_user}/>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <div className='box'>
            <div className='form-group clearfix'>
              <label htmlFor='staff-code' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.staff_code')}
              </label>
              <div className='col-sm-8'>
                <input type='text' className='form-control' id='staff-code'
                  name='staff_code' onChange={this.handleProfileChange.bind(this)}
                  value={this.state.profile.staff_code}
                  />
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='division' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.division')}
              </label>
              <div className='col-sm-8'>
                <input type='text' className='form-control' id='division'
                  name='division'
                  onChange={this.handleProfileChange.bind(this)}
                  value={this.state.profile.division}/>
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='join-div-date' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.join_div_date')}
              </label>
              <div className='col-sm-8'>
                <input type='date' className='form-control' id='join-div-date'
                  name='join_div_date'
                  onChange={this.handleProfileChange.bind(this)}
                  value={this.state.profile.join_div_date}/>
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='contract-date' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.contract_date')}
              </label>
              <div className='col-sm-8'>
                <input type='date' className='form-control' id='contract-date'
                  name='contract_date'
                  onChange={this.handleProfileChange.bind(this)}
                  value={this.state.profile.contract_date}/>
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='university' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.university')}
              </label>
              <div className='col-sm-8'>
                <select id='University' className='form-control'
                  name='university_id'
                  onChange={this.handleProfileChange.bind(this)}
                  value={this.state.profile.university_id}>
                  <option value=''>-- {I18n.t('users.form_select.select_university')}</option>
                  {this.renderOptions(this.props.universities)}
                </select>
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='graduation' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.graduation')}
              </label>
              <div className='col-sm-8'>
                <input type='date' className='form-control' id='graduation'
                  name='graduation'
                  value={this.state.profile.graduation}
                  onChange={this.handleProfileChange.bind(this)}/>
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='naitei-company' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.naitei_company')}
              </label>
              <div className='col-sm-8'>
                <input type='text' className='form-control' id='naitei-company'
                  name='naitei_company'
                  value={this.state.profile.naitei_company}
                  onChange={this.handleProfileChange.bind(this)}/>
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='stage' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.stage')}
              </label>
              <div className='col-sm-8'>
                <strong>{this.props.stage.name}</strong>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <div className='box'>
            <div className='form-group clearfix'>
              <label htmlFor='trainee-type' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.trainee_type')}
              </label>
              <div className='col-sm-8'>
                <select id='trainee-type' className='form-control'
                  name='trainee_type_id'
                  onChange={this.handleProfileChange.bind(this)}
                  value={this.state.profile.trainee_type_id}>
                  <option value=''>-- {I18n.t('users.form_select.select_type')}</option>
                  {this.renderOptions(this.props.trainee_types)}
                </select>
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='start-training-date' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.start_training_date')}
              </label>
              <div className='col-sm-8'>
                <input type='date' className='form-control' id='start-training-date'
                  name='start_training_date'
                  value={this.state.profile.start_training_date}
                  onChange={this.handleProfileChange.bind(this)}/>
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='leave-date' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.leave_date')}
              </label>
              <div className='col-sm-8'>
                <input type='date' className='form-control' id='leave-date'
                  name='leave_date'
                  value={this.state.profile.leave_date}
                  onChange={this.handleProfileChange.bind(this)}/>
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='finish-training-date' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.finish_training_date')}
              </label>
              <div className='col-sm-8'>
                <input type='date' className='form-control' id='finish-training-date'
                  name='finish_training_date'
                  value={this.state.profile.finish_training_date}
                  onChange={this.handleProfileChange.bind(this)}/>
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='language' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.language')}
              </label>
              <div className='col-sm-8'>
                <select id='language' className='form-control'
                  name='language_id'
                  onChange={this.handleProfileChange.bind(this)}
                  value={this.state.profile.language_id}>
                  <option value=''>-- {I18n.t('users.form_select.select_language')}</option>
                  {this.renderOptions(this.props.languages)}
                </select>
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='user-status' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.status')}
              </label>
              <div className='col-sm-8'>
                <select id='user-status' className='form-control'
                  name='user_status_id'
                  onChange={this.handleProfileChange.bind(this)}
                  value={this.state.profile.user_status_id}>
                  <option value=''>-- {I18n.t('users.form_select.select_status')}</option>
                  {this.renderOptions(this.props.user_statuses)}
                </select>
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='working-day' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.working_day')}
              </label>
              <div className='col-sm-8'>
                <input type='number' min='0' id='working-day' className='form-control'
                  name='working_day'
                  value={this.state.profile.working_day}
                  onChange={this.handleProfileChange.bind(this)}  />
              </div>
            </div>
            <div className='form-group clearfix'>
              <label htmlFor='ready-for-project' className='col-sm-4 control-label'>
                {I18n.t('users.profile_detail.ready_for_project')}
              </label>
              <div className='col-sm-8'>
                <select id='ready-for-project' className='form-control'
                  name='ready_for_project'
                  value={this.state.profile.ready_for_project}
                  onChange={this.handleProfileChange.bind(this)}>
                  <option value='false'>{I18n.t('users.profile_detail.not_ready')}</option>
                  <option value='true'>{I18n.t('users.profile_detail.ready')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-12'>
          <div className='form-group'>
            <div className='text-right'>
              <button type='submit' className='btn btn-primary'
                disabled={!this.formValid()}>{I18n.t('users.buttons.create')}</button>
            </div>
          </div>
        </div>
      </form>
    )
  }

  formValid() {
    return this.state.user.name != '' && this.state.user.email != '';
  }

  handleUserChange(event) {
    let attribute = event.target.name;
    Object.assign(this.state.user, {[attribute]: event.target.value});
    this.setState({
      user: this.state.user
    });
  }

  handleProfileChange(event) {
    let attribute = event.target.name;
    Object.assign(this.state.profile, {[attribute]: event.target.value});
    this.setState({
      profile: this.state.profile
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let user = this.state.user;
    let profile = this.state.profile;
    let formData = new FormData();
    for(let key of Object.keys(user)) {
      formData.append('user[' + key + ']', user[key]);
    }
    for(let key of Object.keys(profile)) {
      formData.append('user[profile_attributes][' + key + ']', profile[key]);
    }
    formData.append('user[profile_attributes][stage_id]]', this.props.stage.id);
    formData.append('user[profile_attributes][organization_id]]',
      this.props.organization.id);
    formData.append('authenticity_token', ReactOnRails.authenticityToken());
    let method = 'POST';
    axios({
      url: this.props.url,
      method: method,
      data: formData,
      headers: {'Accept': 'application/json'}
    })
    .then(response => {
      this.setState({
        errors: null,
      });
      window.location.href = this.props.url + response.data.user.id;
    })
    .catch(error => this.setState({errors: error.response.data.errors}));
  }
}

import axios from 'axios';
import FormProgram from './templates/program_form';
import Program from './templates/program';
import React from 'react';
import ProgramPolicy from 'policy/program_policy';

import * as routes from 'config/routes';

require('../../assets/sass/list_programs.scss');

export default class Programs extends React.Component {
   constructor(props) {
    super(props)
    this.state = {
      organization: props.organization,
      programs: props.programs,
      index: null,
      program: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      organization: nextProps.organization,
      programs: nextProps.programs
    });
  }

  render() {
    return (
      <div className="box-programs">
        <div className="form-create">
          <ProgramPolicy permit={[
            {action: ['ownerById'], data: {id: this.state.organization.owner.id}},
            {action: ['create']}
          ]}>
            <FormProgram
              url={routes.organization_programs_url(this.state.organization.id)}
              organization={this.state.organization}
            />
          </ProgramPolicy>
        </div>
        <div id="list-programs">
          <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            {this._renderProgram(routes.programs_url())}
          </div>
          {this.renderModal(this.state.program, routes.program_url(this.state.program.id))}
        </div>
      </div>
    )
  }

  renderModal(program, edit_url) {
    return(
      <div className='modal fade in modalEdit' role='dialog'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close'
                data-dismiss='modal'>&times;</button>
              <h4 className='modal-title'>{I18n.t("buttons.edit")}</h4>
            </div>
            <div className='modal-body'>
              <FormProgram
                url={edit_url}
                organization={this.state.organization}
                program={program}
                handleAfterUpdated={this.handleAfterUpdated.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderProgram(PROGRAMS_URL) {
    return this.state.programs.map((program) => {
      return (
        <div className="program" key={program.id}>
          <Program
            program={program}
            organization={this.state.organization}
            afterEdit={this.afterClickEdit.bind(this)}
            handleAfterDeleted={this.handleAfterDeleted.bind(this)}
            url={PROGRAMS_URL + '/' + program.id}/>
        </div>
      );
    });
  }

  afterClickEdit(program) {
    this.setState({
      program: program
    })
    $('.modalEdit').modal();
  }

  handleAfterDeleted(response) {
    this.setState({
      programs: response.data.programs
    })
  }

  handleAfterUpdated(response) {
    let program = response.data.program;
    let index = this.state.programs.findIndex(item => item.id == program.id);
    this.state.programs[index].name = program.name;
    this.setState({
      programs: this.state.programs
    });
  }
}

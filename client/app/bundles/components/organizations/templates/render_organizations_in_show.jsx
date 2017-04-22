import axios from 'axios';
import Griddle, {plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import ListPrograms from '../programs';
import React from 'react';

import * as app_constants from 'constants/app_constants';

const ORGANIZATIONS_URL = app_constants.APP_NAME + 
app_constants.ORGANIZATIONS_PATH;

export default class OrganizationLists extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      organization: props.organization,
      programs: props.programs,
      index: null,
      name: null,
      parent: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      organization: nextProps.organization,
      programs: nextProps.programs
    });
  }

  render(){
    return(
      <div>
        <ListPrograms
          organization={this.state.organization}
          programs={this.state.programs}
          afterEditProgram={this.fetchData.bind(this)}
          afterCreateProgram={this.fetchData.bind(this)}
          afterDeleteProgram={this.fetchData.bind(this)}/>
      </div>
    )
  }

  fetchData() {
    const url = ORGANIZATIONS_URL+ '/' + this.state.organization.id;
    axios.get(url + ".json")
      .then(response => {
        this.setState({
          organization: response.data.organization,
          programs: response.data.programs
          });
        this.props.handleAfter(this.state.organization, this.state.programs);
      })
      .catch(error => {
        console.log(error)
      });
  }
}


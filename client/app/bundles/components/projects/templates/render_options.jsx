import React from 'react';

export default class RenderOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      project: props.project,
      organization: props.organization,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      project: nextProps.project,
      organization: nextProps.organization
    });
  }

  render() {
    let objects = this.state.organization;
    return (
      <div className='form-group'>
        <select className='form-control' name='organization_id'
          onChange={this.handleChange.bind(this)}
          value={this.state.project.organization_id || ''}>
          <option value=''>{I18n.t('projects.select_organization')}</option>
          {this.renderOptions()}
        </select>
      </div>);
  }

  handleChange(event) {
    this.props.handleChange(event);
  }

  renderOptions() {
    let objects = this.state.organization;
    if (objects) {
      return objects.map(object => {
        return <option key={object.id}
          value={object.id}>{object.name}</option>;
      });
    }
    return null;
  }
}

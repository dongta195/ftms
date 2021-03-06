import * as routes from 'config/routes';
import * as react_table_ultis from 'shared/react-table/ultis';
import css from 'assets/sass/react-table.scss';
import React from 'react';
import ReactTable from 'react-table';
import TrainingStandardPolicy from 'policy/training_standard_policy';

export default class TrainingStandards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      training_standards: props.training_standards,
      organization: props.organization,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      training_standards: nextProps.training_standards,
      organization: nextProps.organization,
    });
  }

  render() {
    const columns = [
      {
        header: '#',
        accessor: 'position',
        render: row => <div className='text-right'>{row.index + 1}</div>,
        hideFilter: true,
        width: 50
      },
      {
        header: I18n.t('training_standards.name'),
        accessor: 'name',
        render: row => {
          return <a title={row.value}
            href={routes.training_standard_url(row.row.id)}>{row.value}</a>
        }
      },
      {
        header: I18n.t('training_standards.description'),
        accessor: 'description',
        render: row => <span title={row.value}>{row.value}</span>
      }
    ]

    return (
      <div>
        <ReactTable
          className='-striped -highlight' data={this.policyFilterData()}
          columns={columns} defaultPageSize={react_table_ultis.defaultPageSize}
          showFilters={true}
          defaultFilterMethod={react_table_ultis.defaultFilter}
        />
      </div>
    );
  }

  handleEdit(event) {
    let $target = $(event.target);
    $target.blur();
    this.setState({
      training_standard: this.state.training_standards[$target.data('index')]
    }, () => {
      $('.modal-edit').modal();
    });
  }

  handleAfterUpdated(new_training_standard) {
    this.props.handleAfterUpdated(new_training_standard);
  }


  policyFilterData() {
    let training_standards = [];
    let policy = new TrainingStandardPolicy({refresh: false});
    for (let training_standard of this.state.training_standards) {
      let permit = [
        {action: ['ownerById'], data: {id: this.state.organization.user_id}},
        {action: ['show', 'creator'], data: {creator_id: training_standard.creator_id}},
        {action: ['show', 'creator'], data: {creator_id: this.state.organization.creator_id}},
        {action: ['show', 'ownerById'], data: {id: this.state.organization.id}}
      ];
      if (policy.checkAllowFunction(permit)) {
        training_standards.push(training_standard);
      }
    }
    return training_standards;
  }
}

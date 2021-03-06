import * as react_table_ultis from 'shared/react-table/ultis';
import * as routes from 'config/routes';
import css from 'assets/sass/react-table.scss';
import React from 'react';
import ReactTable from 'react-table';
import Show from './actions/show';

export default class Exams extends React.Component {
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
        header: I18n.t('exams.headers.user'),
        accessor: 'user.name',
        render: ({row}) => {
          let user_url = routes.user_url(row.user.id);
          return <a href={user_url}>{row.user.name}</a>
        }
      },
      {
        header: I18n.t('exams.headers.subject'),
        accessor: 'subject.name'
      },
      {
        header: I18n.t('exams.headers.course'),
        accessor: 'course.name',
        render: ({row}) => {
          let course_url = routes.course_url(row.course.id);
          return <a href={course_url}>{row.course.name}</a>;
        }
      },
      {
        header: I18n.t('exams.headers.created_at'),
        id: 'created_at',
        accessor: d => I18n.l('time.formats.default', d.created_at),
        style: {textAlign: 'right'},
        width: 150
      },
      {
        header: I18n.t('exams.headers.spent_time'),
        accessor: 'spent_time',
        filterMethod: react_table_ultis.defaultNumberFilter,
        style: {textAlign: 'right'},
        width: 125
      },
      {
        header: I18n.t('exams.headers.score'),
        accessor: 'score',
        filterMethod: react_table_ultis.defaultNumberFilter,
        style: {textAlign: 'right'},
        width: 75
      },
      {
        header: I18n.t('exams.headers.status'),
        accessor: 'status',
        style: {textAlign: 'right'},
        width: 75
      },
      {
        header: '',
        id: 'view',
        accessor: d => {
          return <Show exam={d} organization={this.props.organization} />
        },
        style: {textAlign: 'center'},
        hideFilter: true,
        sortable: false,
        width: 75
      }
    ];

    return (
      <div className='exams-table'>
        <ReactTable className='-striped -highlight' data={this.props.exams}
          columns={columns} defaultPageSize={react_table_ultis.defaultPageSize}
          showFilters={true}
          defaultFilterMethod={react_table_ultis.defaultFilter}
        />
      </div>
    );
  }
}

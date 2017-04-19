import React from 'react';
import axios from 'axios';

import * as app_constants from 'constants/app_constants';
import * as training_standard_constants from '../constants/training_standard_constants';

export default class Destroy extends React.Component {
  render() {
    return (
      <button className='btn btn-danger' title={I18n.t('buttons.delete')}
        onClick={this.handleDelete.bind(this)}>
        <i className="fa fa-trash-o"></i> {I18n.t('buttons.delete')}
      </button>
    );
  }

  handleDelete(event) {
    let $target = $(event.target);
    $target.blur();
    let training_standard = this.props.training_standard;
    if (confirm(I18n.t('data.confirm_delete'))) {
      const TRAINING_STANDARD_URL = app_constants.APP_NAME +
        training_standard_constants.ORGANIZATION_PATH + '/' +
        this.props.organization.id + '/' +
        training_standard_constants.TRAINING_STANDARD_PATH;

      axios.delete(TRAINING_STANDARD_URL + '/' + training_standard.id, {
        params: {
          authenticity_token: ReactOnRails.authenticityToken()
        },
        headers: {'Accept': 'application/json'}
      })
      .then(response => {
        this.props.handleAfterDeleted(training_standard);
      })
      .catch(error => console.log(error));
    }
  }
}
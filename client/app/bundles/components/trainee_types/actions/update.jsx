import axios from 'axios';
import React from 'react';

export default class Update extends React.Component {
  render () {
    return (
      <button type='submit' className='btn btn-primary'
        onClick={this.handleSubmit.bind(this)}>
        <i className="fa fa-floppy-o"></i>
        &nbsp;{I18n.t('buttons.save')}
      </button>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    let formData = new FormData();

    let attributes = this.props.attributes;

    for(let key of Object.keys(attributes)) {
      formData.append(this.props.params + '[' + key + ']', attributes[key]);
    }
    formData.append('authenticity_token', ReactOnRails.authenticityToken());
    axios({
      url: this.props.url,
      method: 'PATCH',
      data: formData,
      headers: {'Accept': 'application/json'}
    })
    .then(response => {
      $('.modalEdit').modal('hide');
      this.props.handleAfterUpdated(response);
    })
    .catch(error => {
      console.log(error);
    });
  }
}

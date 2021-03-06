import React from 'react';
import axios from 'axios';

export default class Create extends React.Component {
  render() {
    return (
      <button type='submit'
        onClick={this.handleSubmit.bind(this)}
        className='btn btn-primary' >
        <i className="fa fa-floppy-o"></i>
        &nbsp;{I18n.t('buttons.save')}
      </button>
     );
   }

  handleSubmit(event) {
    event.preventDefault();
    let formData = new FormData();

    let stage = _.omit(this.props.state, 'errors');

    for(let key of Object.keys(stage)) {
      formData.append('stage[' + key + ']', stage[key]);
    }

    formData.append('authenticity_token', ReactOnRails.authenticityToken());
    axios({
      url: this.props.url,
      method: 'POST',
      data: formData,
      headers: {'Accept': 'application/json'}
    })
    .then(response => {
      this.props.handleAfterCreated(response.data.stage);
    })
    .catch(error => {
      console.log(error);
    });
  }
}

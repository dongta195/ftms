import BasePolicy from '../base_policy';

export default class TeamPolicy extends BasePolicy {
  constructor(props) {
    super(props);
    this.registerRefresh(this);
  }
}

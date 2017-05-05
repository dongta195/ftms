import BasePolicy from '../base_policy';

export default class CoursePolicy extends BasePolicy {
  constructor(props) {
    super(props);
    this.registerRefresh(this);
    this.controller = 'courses';
  }
}

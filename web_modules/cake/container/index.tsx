import React, { Component } from 'react';

import List from './component/list';

import './index.less';

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <List {...this.props}></List>;
  }
}

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import appStore from '../../../src/store';

import { Layout } from 'antd';

import CustomHeader from './component/header';

import './index.less';

const { Content } = Layout;

@observer
export default class Decorator extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { pathname } = appStore;
    const isShowMicroApp = (pathname && pathname.startsWith('/micro-app'));

    return (
      <Layout className="root-layout-wrap">
        <CustomHeader />
        <Layout>
          <Content className="decorator-layout-content">
            <div
              className="decorator-content-wrap"
              style={{display: isShowMicroApp ? 'none' : 'block'}}
            >
              {this.props.children}
            </div>
            <div
              className="decorator-content-wrap"
              id="micro-container"
              style={{display: isShowMicroApp ? 'block' : 'none'}}
            />
          </Content>
        </Layout>
      </Layout>
    );
  };
}

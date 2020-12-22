import React, { Component } from 'react';
import { observer } from 'mobx-react';
import globalState from '@globalState';

@observer
export default class Tags extends Component {
  private increaseState = () => {
    const currentNumber = globalState.get('number');
    if (!currentNumber) {
      globalState.set({ number: 1 });
    } else {
      globalState.set({ number: currentNumber + 1 });
    }
  }


    render() {
        return (
            <div className="main-page">
              <p>微应用首页</p>
              <button onClick={this.increaseState}>number + 1</button>
              <p>全局状态number值：{globalState.get('number')}</p>
            </div>
        );
    }
}

import './index.less';
import './iconfont/iconfont';

import React, { Component } from 'react';

interface IProps {
  style?: object;
  className?: string;
  type: string;
  svg: string;
  onClick?: () => {};
}

export default class Icon extends Component<IProps> {
  render() {
    const { style, className, type, svg, onClick, ...other } = this.props;
    return (
      <span className="anticon" onClick={onClick} {...other}>
        {svg ? (
          <svg
            className={`iconsvg ${className}`}
            style={style}
            aria-hidden="true"
          >
            <use xlinkHref={`#${type}`} />
          </svg>
        ) : (
          <i className={`iconfont ${type} ${className}`} style={style} />
        )}
      </span>
    );
  }
}

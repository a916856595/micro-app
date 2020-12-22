import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Icon } from 'cake';

export default class List extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      drawer: undefined,
      active: '',
    };
  }

  componentDidMount() {
    const { active } = this.props;
    this.setState({ active });
  }

  render() {
    const { className, Tag } = this.props;

    return (
      <div
        className={className ? `container-wrap ${className}` : 'container-wrap'}
      >
        <div className="container-out-wrap">
          <div
            className={
              this.state.drawer === undefined
                ? 'container-left-wrap'
                : this.state.drawer === true
                ? 'container-left-wrap container-left-wrap-open'
                : ' container-left-wrap container-left-wrap-close'
            }
          >
            <Link to={`/geometry`}>
              <div
                className={
                  this.state.active === 'geometry'
                    ? 'container-link-wrap management-wrap management-wrap-active'
                    : 'container-link-wrap management-wrap'
                }
                onClick={() => this.managementClick('geometry')}
              >
                <Icon type="icon-icon-road" className="icon-division2" svg />
                <Icon
                  type="icon-icon-road-white"
                  className="icon-division2 management-active"
                  svg
                />
              </div>
            </Link>
            <Link to={`/division`}>
              <div
                className={
                  this.state.active === 'division'
                    ? 'container-link-wrap administrative-wrap administrative-wrap-active'
                    : 'container-link-wrap administrative-wrap'
                }
                onClick={() => this.managementClick('division')}
              >
                <Icon type="icon-icon-face" className="icon-division2 " svg />
                <Icon
                  type="icon-icon-face-white"
                  className="icon-division2 administrative-active"
                  svg
                />
              </div>
            </Link>
            <Link to={`/areas`}>
              <div
                className={
                  this.state.active === 'areas'
                    ? 'container-link-wrap regional-wrap regional-wrap-active'
                    : 'container-link-wrap regional-wrap'
                }
                onClick={() => this.managementClick('areas')}
              >
                <Icon type="icon-icon-point" className="icon-division2" svg />
                <Icon
                  type="icon-icon-point-white"
                  className="icon-division2 regional-active"
                  svg
                />
              </div>
            </Link>

            <div className="container-drawer-wrap" onClick={this.drawerClick}>
              {this.state.drawer === true || this.state.drawer === undefined ? (
                <Icon type="icon-icon-drop-down3" className="icon-drawer" svg />
              ) : (
                <Icon type="icon-icon-drop-down4" className="icon-drawer" svg />
              )}
              {this.state.drawer === true || this.state.drawer === undefined ? (
                <Icon
                  type="icon-icon-drop-down5"
                  className="icon-drawer drawer-active"
                />
              ) : (
                <Icon
                  type="icon-icon-drop-down4"
                  className="icon-drawer drawer-active"
                />
              )}
            </div>
          </div>
          <div
            className={
              this.state.drawer === undefined
                ? 'container-right-wrap'
                : this.state.drawer === true
                ? 'container-right-wrap container-right-wrap-open'
                : 'container-right-wrap container-right-wrap-close'
            }
          >
            <Tag />
          </div>
        </div>
      </div>
    );
  }

  /**
   *  抽屉
   */
  private drawerClick = () => {
    try {
      if (this.state.drawer === undefined) {
        this.setState({ drawer: false });
      } else {
        this.setState({ drawer: !this.state.drawer });
      }
    } catch (error) {}
  };

  /**
   *  路由切换
   */
  private managementClick = (type) => {
    try {
      if (this.state.drawer === false) {
        this.setState({ drawer: true });
      }
      this.setState({ active: type });
    } catch (error) {}
  };
}

export default [
  {
    exact: true,
    path: '/main',
    breadcrumb: '微应用首页',
    render: (props) =>
        import(/* webpackChunkName: "root-page" */ './pages/main/'),
  },
  {
    exact: true,
    path: '/test',
    breadcrumb: '微应用测试页',
    render: (props) =>
        import(/* webpackChunkName: "test" */ './pages/test/'),
  },
  {
    exact: true,
    path: '/micro-app',
    breadcrumb: '微应用容器页',
    render: (props) =>
      import(/* webpackChunkName: "micro-app" */ './pages/micro-app/'),
  }
];

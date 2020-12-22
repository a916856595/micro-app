import loadable from 'async-loadable';
import Icon from './icons';

const Decorator = loadable({
  component: () => import(/* webpackChunkName: "decorator" */ './decorator'),
});

const Container = loadable({
  component: () => import(/* webpackChunkName: "container" */ './container'),
});

export {
  Decorator,
  Container,
  Icon,
};

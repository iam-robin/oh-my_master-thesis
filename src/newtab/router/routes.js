import Page1 from './pages/Page1';
import List from './pages/List';
import Ratio from './pages/Ratio';
import Limit from './pages/Limit';

export default [
  {
    path: '/',
    redirect: {
      name: 'list',
    },
  },
  {
    path: '/page1',
    name: 'page1',
    component: Page1,
  },
  {
    path: '/list',
    name: 'list',
    component: List,
    props: true,
  },
  {
    path: '/ratio',
    name: 'ratio',
    component: Ratio,
  },
  {
    path: '/limit',
    name: 'limit',
    component: Limit,
  },
];

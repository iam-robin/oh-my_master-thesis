import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';

export default [
  { path: '/', redirect: '/page1' },
  {
    path: '/page1',
    name: 'page1',
    component: Page1,
  },
  {
    path: '/page2',
    name: 'page2',
    component: Page2,
  },
  {
    path: '/page3',
    name: 'page3',
    component: Page3,
  },
];

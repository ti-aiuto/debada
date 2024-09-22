import {createMemoryHistory, createRouter} from 'vue-router';

import PlayPage from './pages/Play.vue';
import TopPage from './pages/Top.vue';
import RulePage from './pages/Rule.vue';
import ResultPage from './pages/Result.vue';
import PreparePage from './pages/Prepare.vue';

const routes = [
  {path: '/', component: TopPage},
  {path: '/rule', component: RulePage},
  {path: '/play', component: PlayPage},
  {path: '/prepare', component: PreparePage},
  {path: '/result', component: ResultPage},
  {path: '/result', component: ResultPage},
];

export const router = createRouter({
  history: createMemoryHistory(), // 勝手に遷移されると困るので実環境でもこれでいく
  routes,
});

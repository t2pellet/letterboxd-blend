import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import MatchForm from '@/pages/match/MatchForm.vue';
import BlendResult from '@/pages/blend/BlendResult.vue';
import BlendForm from '@/pages/blend/BlendForm.vue';
import MatchWait from '@/pages/match/MatchWait.vue';
import Match from '@/pages/match/Match.vue';
import MatchSwipe from '@/pages/match/MatchSwipe.vue';
import MatchResult from '@/pages/match/MatchResult.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/blend', component: BlendForm },
  { path: '/result', component: BlendResult },
  { path: '/match', component: MatchForm },
  {
    path: '/match/:code',
    component: Match,
    children: [
      { path: 'wait', component: MatchWait },
      { path: 'swipe', component: MatchSwipe },
      { path: 'result', component: MatchResult },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

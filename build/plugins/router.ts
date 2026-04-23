import type { RouteMeta } from 'vue-router';
import ElegantVueRouter from '@elegant-router/vue/vite';
import type { RouteKey } from '@elegant-router/types';

export function setupElegantRouter() {
  return ElegantVueRouter({
    layouts: {
      base: 'src/layouts/base-layout/index.vue',
      blank: 'src/layouts/blank-layout/index.vue'
    },
    routePathTransformer(routeName, routePath) {
      const key = routeName as RouteKey;

      if (key === 'login') {
        const modules: UnionKey.LoginModule[] = [
          'pwd-login',
          // 'code-login',
          // 'register',
          // 'reset-pwd',
          'bind-wechat'
        ];

        const moduleReg = modules.join('|');

        return `/login/:module(${moduleReg})?`;
      }

      const customRoutePaths: Partial<Record<RouteKey, string>> = {
        admin: '/_internal/admin',
        admin_feedback: '/_internal/admin/feedback',
        admin_feedback_forms: '/_internal/admin/feedback/list',
        admin_users: '/_internal/admin/users',
        admin_users_list: '/_internal/admin/users/list',
        feedbackmanage: '/admin/feedback',
        feedbackmanage_list: '/admin/feedback/list',
        usermanage: '/admin/users',
        usermanage_list: '/admin/users/list'
      };

      if (customRoutePaths[key]) {
        return customRoutePaths[key];
      }

      return routePath;
    },
    onRouteMetaGen(routeName) {
      const key = routeName as RouteKey;

      const constantRoutes: RouteKey[] = ['login', '403', '404', '500', 'feedback'];

      const meta: Partial<RouteMeta> = {
        title: key,
        i18nKey: `route.${key}` as App.I18n.I18nKey
      };

      if (constantRoutes.includes(key)) {
        meta.constant = true;
      }

      if (key === 'feedback') {
        meta.hideInMenu = true;
      }

      const hiddenInternalRoutes: RouteKey[] = [
        'admin',
        'admin_feedback',
        'admin_feedback_forms',
        'admin_users',
        'admin_users_list'
      ];

      if (hiddenInternalRoutes.includes(key)) {
        meta.hideInMenu = true;
      }

      if (key === 'home') {
        meta.icon = 'lucide:house';
        meta.order = 1;
        meta.roles = ['R_ADMIN', 'R_SUPER'];
      }

      if (key === 'feedbackmanage') {
        meta.icon = 'lucide:messages-square';
        meta.order = 2;
        meta.roles = ['R_ADMIN', 'R_SUPER'];
      }

      if (key === 'feedbackmanage_list') {
        meta.order = 1;
        meta.roles = ['R_ADMIN', 'R_SUPER'];
      }

      if (key === 'usermanage') {
        meta.icon = 'lucide:users-round';
        meta.order = 3;
        meta.roles = ['R_ADMIN', 'R_SUPER'];
      }

      if (key === 'usermanage_list') {
        meta.order = 1;
        meta.roles = ['R_ADMIN', 'R_SUPER'];
      }

      return meta;
    }
  });
}

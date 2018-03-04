'use strict';

// HOC for check auth


const routes = [
  {
    path: '/',
    component: AppLayout,
    childRoutes: [
      {
        path: '/auth',
        childRoutes: [
        {
          path: 'login/',
          component: LoginPage,
        },
        {
          path: 'register/',
          component: RegisterPage,
        },
        {
          path: 'reset-password/',
          component: ResetPasswordPage,
        }, ],
      },
    ]
  },
  { path: '*', component: NotFound },
]

export default routes

/*
  /
  /auth/
  /auth/registration
  /auth/password-reset
  /dashboard
  /items
  /item/:id
*/

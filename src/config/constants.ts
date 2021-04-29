export const Routes = {
  workoutPlan: {
    controller: 'workout_plans',
    get: {
      one: '/:ownerName/:workoutPlanName',
    },
    patch: {
      one: '/:ownerName/:workoutPlanName',
    },
    delete: {
      one: '/:ownerName/:workoutPlanName',
    },
  },
  auth: {
    controller: 'auth',
    post: {
      login: '/login',
      register: '/register',
      resendEmail: '/mail/confirmation/resend/',
    },
    get: {
      emailConfirmationToken: '/mail/confirmation/:token',
    },
  },
};

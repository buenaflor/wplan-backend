export const Routes = {
  user: {
    controller: '/users',
    get: {
      one: '/:username',
      workoutPlansByOne: '/:username/workout_plans',
    },
  },
  authUser: {
    controller: '/user',
    get: {
      workoutPlans: '/workout_plans',
    },
    post: {
      workoutPlans: '/workout_plans',
    },
  },
  workoutPlan: {
    controller: 'workout_plans',
    get: {
      one: '/:ownerName/:workoutPlanName',
      collaborators: '/:ownerName/:workoutPlanName/collaborators',
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

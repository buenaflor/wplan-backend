export const Routes = {
  user: {
    controller: '/users',
    get: {
      one: '/:username',
      workoutPlansByOne: '/:username/workout_plans',
    },
  },
  authUser: {
    controller: '/me',
    get: {
      workoutPlans: '/workout_plans',
      workoutPlanInvitations: '/workout_plan_invitations',
    },
    post: {
      workoutPlans: '/workout_plans',
    },
    patch: {
      acceptWorkoutPlanInvitation: '/workout_plan_invitations/:invitationId',
    },
    delete: {
      declineWorkoutPlanInvitation: '/workout_plan_invitations/:invitationId',
    },
  },
  workoutPlan: {
    controller: 'workout_plans',
    get: {
      one: '/:workoutPlanId',
      openInvitations: ':workoutPlanId/invitations',
      collaborators: '/:workoutPlanId/collaborators',
      workoutDays: '/:workoutPlanId/workout_days',
    },
    patch: {
      one: '/:workoutPlanId',
    },
    delete: {
      one: '/:workoutPlanId',
    },
    put: {
      inviteCollaborator: '/:workoutPlanId/collaborators/:inviteeUsername',
    },
  },
  auth: {
    controller: 'auth',
    post: {
      login: '/login',
      register: '/register',
      resendEmail: '/mail_confirmation/:token/resend/',
    },
    get: {
      emailConfirmationToken: '/mail_confirmation/:token',
    },
  },
};

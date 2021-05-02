const owner = 'ownerUsername';
const workoutPlan = 'workoutPlanName';

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
      one: '/:ownerName/:workoutPlanName',
      collaborators: '/:ownerName/:workoutPlanName/collaborators',
    },
    patch: {
      one: '/:ownerName/:workoutPlanName',
    },
    delete: {
      one: '/:ownerName/:workoutPlanName',
    },
    put: {
      inviteCollaborator:
        '/:ownerName/:workoutPlanName/collaborators/:username',
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

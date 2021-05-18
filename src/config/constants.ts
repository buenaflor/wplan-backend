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
      workoutPlan: '/workout_plans/:workoutPlanId',
      acceptWorkoutPlanInvitation: '/workout_plan_invitations/:invitationId',
    },
    delete: {
      workoutPlan: '/workout_plans/:workoutPlanId',
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
      workoutDay: '/:workoutPlanId/workout_days/:workoutDayId',
    },
    delete: {
      one: '/:workoutPlanId',
    },
    post: {
      workoutDays: '/:workoutPlanId/workout_days',
    },
    put: {
      inviteCollaborator: '/:workoutPlanId/collaborators/:inviteeUsername',
    },
  },
  workoutDay: {
    controller: 'workout_days',
    get: {
      one: '/:workoutDayId',
    },
    delete: {
      one: '/:workoutDayId',
    },
    put: {
      multiple: '',
    },
    exerciseRoutine: {
      get: {
        all: '/:workoutDayId/exercise_routines',
      },
      post: {
        one: '/:workoutDayId/exercise_routines',
      },
    },
  },
  exerciseRoutine: {
    controller: 'exercise_routines',
    get: {
      one: '/:exerciseRoutineId',
    },
    put: {
      one: '/:exerciseRoutineId',
    },
    delete: {
      one: '/:exerciseRoutineId',
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

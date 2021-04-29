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
};

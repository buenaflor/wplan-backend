import { AppAbility } from '../casl/workout-ability-factory.service';

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

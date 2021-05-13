import { IPolicyHandler } from './policy.handler';
import { AppAbility } from '../casl/casl-ability.factory';

export abstract class AbstractPolicyFactory {
  protected handlers: Map<string, IPolicyHandler> = new Map<
    string,
    IPolicyHandler
  >();

  setHandler(key: string, handler: IPolicyHandler) {
    this.handlers.set(key, handler);
  }

  getHandler(key: string) {
    return this.handlers.get(key);
  }

  authorize(key: string, ability: AppAbility) {
    const handler = this.handlers.get(key) as IPolicyHandler;
    return handler.handle(ability);
  }
}

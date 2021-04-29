import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Paginated = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    let page = query.page;
    let perPage = query.per_page;
    if (!page) page = 1;
    if (!perPage) perPage = 30;
    return {
      page,
      limit: perPage,
    };
  },
);

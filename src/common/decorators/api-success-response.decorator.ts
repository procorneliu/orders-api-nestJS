import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { MetaResponseDto } from '../dtos/meta-response.dto';

export const ApiSuccessResponse = <TModel extends Type<any>>(
  model: TModel,
  options = { isArray: false, isPaginate: false },
) => {
  const dataSchema = options.isArray
    ? { type: 'array', items: { $ref: getSchemaPath(model) } }
    : { $ref: getSchemaPath(model) };

  // if not, return type array, that is not visible
  const metaSchema = options.isPaginate ? { type: 'object', $ref: getSchemaPath(MetaResponseDto) } : { type: 'array' };

  return applyDecorators(
    ApiExtraModels(MetaResponseDto, model),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          data: dataSchema,
          meta: metaSchema,
        },
      },
    }),
  );
};

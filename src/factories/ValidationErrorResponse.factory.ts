import ajv from 'ajv';

export const createAjvValidationErrorResponse = (
  errors?: ajv.ErrorObject[] | null
) => {
  if (!errors) return;

  const messages = errors.map(err => err.message!);
  return { Errors: messages };
};

export const createValidationErrorResponse = (errors: string[] | undefined) => {
  if (!errors) return;

  return { Errors: errors };
};

/**
 * Zod validation middleware
 */
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const messages = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      const err = new Error(messages.join('; '));
      err.status = 400;
      return next(err);
    }

    next();
  };
}

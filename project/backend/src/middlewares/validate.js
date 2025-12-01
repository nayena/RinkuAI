const z = require('zod');

const validate = (schema) => (req, _res, next) =>{
    const parsed = schema.safeParse({ 
        body: req.body,
        params: req.params, 
        query: req.query
    });
    if(!parsed.success){
        const msg = parsed.error.issues.map(i => i.message).join(";");
        return next({ status: 400, message: msg});
    }
    next();
};

module.exports = { validate };
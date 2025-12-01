function errorHandler(err, _req, res, _next) {
    if (err && err.status) return res.status(err.status).json({ error: err.message});
    console.error(err);
    res.status(500).json({error: "Internal Server Error"});
}

module.exports = errorHandler;
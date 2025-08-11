export default (req, res, next) => {
    const {
        files,
    } = req;
    if (files && Object.keys(files).length) {
        Object.assign(req.body, { ...files });
    }
    return next();
};

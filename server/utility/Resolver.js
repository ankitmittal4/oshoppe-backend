function Resolver(req, res, businessLogic) {
    businessLogic(req.body)
        .then((result) => {
            const cookieOptions = {
                httpOnly: true,
                secure: true,
            };
            if (result.data.accessToken) {
                res.status(200)
                    .cookie('accessToken', result.data.accessToken, cookieOptions)
                    .json(result);
            } else {
                res.status(200).json(result);
            }
        })
        .catch((err) => res.json(err));
}

export default Resolver;

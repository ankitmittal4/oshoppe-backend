/* eslint-disable max-len */
/* eslint-disable import/named */
import PaymentController from '../controllers/payment';
import { ResolverUtility } from '../utility';

const prefix = '/api/payment/';

export default (app) => {
    app.get(
        `${prefix}webPage`,
        (req, res) => {
            const {
                query: {
                    id,
                    orderId,
                },
            } = req;
            PaymentController.PaymentWebPageController({ id, orderId })
                .then((sucess) => {
                    res.set('Content-Type', 'text/html');
                    res.send(sucess.data);
                })
                .catch((err) => res.send(err));
        },
    );
    app.post(
        `${prefix}generateDetail`,
        (req, res) => ResolverUtility(req, res, PaymentController.PaymentGenerateDetailController),
    );
    app.post(
        `${prefix}webhook`,
        (req, res) => ResolverUtility(req, res, PaymentController.PaymentWebhookController),
    );
};

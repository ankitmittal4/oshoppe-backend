export const {
    NODE_ENV,
    BASE_URL,
    MONGO_CONNECTION_STRING,
    PORT,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY = '40d',
    SECRET_STRING,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    S3_BUCKET,
    S3_IMAGE_URL,
    RAZORPAY_ID_KEY,
    RAZORPAY_SECRET_KEY,
    GOOGLE_PLACE_API_KEY,
    MAPPLE_API_KEY,
} = process.env;

export const ORDER_STATUS = {
    PENDING: 1,
    CONFIRMED: 2,
    PROCESSING: 3,
    SHIPPED: 4,
    IN_TRANSIT: 5,
    OUT_FOR_DELIVERY: 6,
    DELIVERED: 7,
    CANCELLED: 8,
    RETURNED: 9,
    REFUNDED: 10,
    FAILED: 11,
    ON_HOLD: 12,
};

export const ORDER_STATUS_MESSAGE = {
    1: 'Awaiting for Approval',
    2: 'Your order is placed successfully',
    3: 'Preparing the order for shipment',
    4: 'Order has been shipped to a nearby dealer',
    5: 'In Transit, Your Order will be delivered shorty',
    6: 'Your order is out for delivery',
    7: 'Your order has been delivered successful',
    8: 'Your order has been cancelled',
    9: 'Your order has been successfully returned',
    10: 'Your refund for the order has been processed successfully',
    11: 'Your payment for the order has failed',
    12: 'Your order on hold, we will update the status shortly',
};

export const ORDER_TYPE = {
    NORMAL: 1,
};

export const USER_TYPE = {
    ADMIN: 1,
    DEALER: 2,
    CUSTOMER: 3,
};

export const TRANSACTION_STATUS = {
    PENDING: 1,
    COMPLETED: 2,
    FAILED: 3,
};

export const ADVISOR_WORK_MODE = {
    PART_TIME: 1,
    FULL_TIME: 2,
};

export const WISHLIST_ACTION = {
    ADD: 1,
    REMOVE: 2,
};

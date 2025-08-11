/* eslint-disable max-len */
/* eslint-disable import/named */
import AdminController from '../controllers/admin';
import OrderController from '../controllers/order';
import { ResolverUtility } from '../utility';
import { MultipartMiddleware, AuthenticationMiddleware } from '../middlewares';
import {
    AdminValidator, ProductValidator, DealerValidator, ProductDealerValidator, CustomerValidator, OrderValidator,
} from '../validation';

const prefix = '/api/admin/';

export default (app) => {
    app.post(
        `${prefix}signup`,
        MultipartMiddleware,
        AdminValidator.signup,
        (req, res) => ResolverUtility(req, res, AdminController.AdminSignupController),
    );
    app.post(
        `${prefix}login`,
        AdminValidator.login,
        (req, res) => ResolverUtility(req, res, AdminController.AdminLoginController),
    );
    app.post(
        `${prefix}dashboard`,
        AuthenticationMiddleware.authenticateAdmin,
        (req, res) => ResolverUtility(req, res, AdminController.AdminDashboardController),
    );
    app.post(
        `${prefix}product/add`,
        MultipartMiddleware,
        AuthenticationMiddleware.authenticateAdmin,
        ProductValidator.productAdd,
        (req, res) => ResolverUtility(req, res, AdminController.AdminProductAddController),
    );
    app.post(
        `${prefix}product/list`,
        MultipartMiddleware,
        AuthenticationMiddleware.authenticateAdmin,
        (req, res) => ResolverUtility(req, res, AdminController.AdminProductListController),
    );
    app.post(
        `${prefix}product/detail`,
        AuthenticationMiddleware.authenticateAdmin,
        ProductValidator.productDetail,
        (req, res) => ResolverUtility(req, res, AdminController.AdminProductDetailController),
    );
    app.post(
        `${prefix}product/delete`,
        AuthenticationMiddleware.authenticateAdmin,
        ProductValidator.productDelete,
        (req, res) => ResolverUtility(req, res, AdminController.AdminProductDeleteController),
    );
    app.post(
        `${prefix}dealer/add`,
        MultipartMiddleware,
        AuthenticationMiddleware.authenticateAdmin,
        DealerValidator.dealerAdd,
        (req, res) => ResolverUtility(req, res, AdminController.AdminDealerAddController),
    );
    app.post(
        `${prefix}dealer/list`,
        AuthenticationMiddleware.authenticateAdmin,
        DealerValidator.dealerList,
        (req, res) => ResolverUtility(req, res, AdminController.AdminDealerListController),
    );
    app.delete(
        `${prefix}dealer/delete`,
        AuthenticationMiddleware.authenticateAdmin,
        DealerValidator.dealerDelete,
        (req, res) => ResolverUtility(req, res, AdminController.AdminDealerDeleteController),
    );
    app.post(
        `${prefix}dealer/unlink`,
        AuthenticationMiddleware.authenticateAdmin,
        ProductDealerValidator.unlinkProductWithDealer,
        (req, res) => ResolverUtility(req, res, AdminController.AdminDealerUnlinkController),
    );
    app.post(
        `${prefix}dealer/link`,
        AuthenticationMiddleware.authenticateAdmin,
        ProductDealerValidator.linkProductWithDealer,
        (req, res) => ResolverUtility(req, res, AdminController.AdminDealerLinkController),
    );
    app.post(
        `${prefix}customer/list`,
        AuthenticationMiddleware.authenticateAdmin,
        CustomerValidator.customerList,
        (req, res) => ResolverUtility(req, res, AdminController.AdminCustomerListController),
    );
    app.patch(
        `${prefix}customer/edit`,
        AuthenticationMiddleware.authenticateAdmin,
        MultipartMiddleware,
        CustomerValidator.customerEdit,
        (req, res) => ResolverUtility(req, res, AdminController.AdminCustomerEditController),
    );
    app.delete(
        `${prefix}customer/delete`,
        AuthenticationMiddleware.authenticateAdmin,
        CustomerValidator.customerDelete,
        (req, res) => ResolverUtility(req, res, AdminController.AdminCustomerDeleteController),
    );
    // Order
    app.post(
        `${prefix}order/list`,
        AuthenticationMiddleware.authenticateAdmin,
        OrderValidator.adminOrderList,
        (req, res) => ResolverUtility(req, res, OrderController.OrderAdminListController),
    );
    app.post(
        `${prefix}order/detail`,
        AuthenticationMiddleware.authenticateAdmin,
        OrderValidator.orderDetail,
        (req, res) => ResolverUtility(req, res, OrderController.OrderAdminDetailController),
    );
    app.post(
        `${prefix}order/update`,
        AuthenticationMiddleware.authenticateAdmin,
        OrderValidator.orderUpdate,
        (req, res) => ResolverUtility(req, res, OrderController.OrderUpdateController),
    );
    app.post(
        `${prefix}order/delete`,
        AuthenticationMiddleware.authenticateAdmin,
        OrderValidator.orderDelete,
        (req, res) => ResolverUtility(req, res, OrderController.OrderDeleteController),
    );
    app.post(
        `${prefix}order/activityList`,
        AuthenticationMiddleware.authenticateAdmin,
        OrderValidator.activityList,
        (req, res) => ResolverUtility(req, res, OrderController.OrderActivityListController),
    );

    // Upload color excel
    app.get(
        `${prefix}uploadExcel`,
        (req, res) => ResolverUtility(req, res, AdminController.AdminUploadColorShadesController),
    );

    // Color
    app.post(
        `${prefix}colorList`,
        AuthenticationMiddleware.authenticateAdmin,
        (req, res) => ResolverUtility(req, res, AdminController.AdminColorListController),
    );
};

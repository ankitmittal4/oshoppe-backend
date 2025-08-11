/* eslint-disable no-promise-executor-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { WishlistModel } from '../../models';
import { WISHLIST_ACTION } from '../../constants';

export default ({
    id,
    productRef,
    action = WISHLIST_ACTION.ADD,
}) => new Promise(async (resolve, reject) => {
    try {
        let wishlist = await WishlistModel.findOne({ customerRef: id });

        if (!wishlist) {
            // Create a new wishlist for the user if none exists
            wishlist = new WishlistModel({ customerRef: id, wishlist: [] });
        }

        if (action === WISHLIST_ACTION.ADD) {
            // Add product to wishlist if not already present
            if (!wishlist.wishlist.includes(productRef)) {
                wishlist.wishlist.push(productRef);
            } else {
                return resolve(new ApiResponseUtility({ message: 'Product already in wishlist!' }));
            }
        } else if (action === WISHLIST_ACTION.REMOVE) {
            // Remove product from wishlist if present
            wishlist.wishlist = wishlist.wishlist.filter(
                (id_) => id_.toString() !== productRef,
            );
        } else {
            return reject(new ApiErrorUtility({ message: 'Invalid action' }));
        }

        // Save the updated wishlist
        await wishlist.save();

        resolve(new ApiResponseUtility({ message: `Product ${action === WISHLIST_ACTION.ADD ? 'added to' : 'removed from'} wishlist` }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while modifying wishlist', error }));
    }
});

const favoritesService = require('../services/favoritesService')

const Addfavorites = async (req, res) => {
    try {
        const { user_id, product_id } = req.body
        const obj = {
            user_id,
            product_id
        };

        const favorite = await favoritesService.Addfavorites(obj);
        if (favorite.affectedRows === 0) {
            res.status(400).json({
                message: 'No favorites added'
            })
        }
        else {
            res.status(200).json({
                message: 'favorites added successfully',
                favorite
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Interanl Server Error',
            error: error.message
        })
    }
}

const Deletefavorites = async (req, res) => {
    try {
        const id = req.params.id;
        const favorite = await favoritesService.Deletefavorites(id);
        if (!favorite) {
            res.status(404).json({
                message: 'No favorites Remove'
            })
        }
        else {
            res.status(200).json({
                message: 'favorites Remove successfully',
                favorite
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Interanl Server Error',
            error: error.message
        })
    }
}

const GetfavoritesByProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const favorite = await favoritesService.GetfavoritesByProduct(productId, res);
        if (!favorite) {
            res.status(404).json({
                message: 'No favorites found'
            })
        }
        else {
            res.status(200).json({
                message: 'favorites found successfully',
                data: favorite
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

const GetfavoritesByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const favorites = await favoritesService.GetfavoritesByUser(userId);
        if (!favorites) {
            res.status(404).json({
                message: 'No favorites found'
            })
        }
        else {
            res.status(200).json({
                message: 'favorites found successfully',
                data: favorites
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

// const Getfavorites = async (req, res) => {
//     try {
//         const { page, limit, orderBy, orderDirection, ...filterParams } = req.query;
//         const pagination = { page, limit, orderBy, orderDirection };
//         const favorites = await favoritesService.Getfavorites(pagination, filterParams);
//         if (favorites.lenght === 0) {
//             res.status(404).json({
//                 message: 'No favorites found'
//             })
//         }
//         else {
//             res.status(200).json({
//                 message: 'favorites found successfully',
//                 data: favorites
//             })
//         }
//     }
//     catch (error) {
//         res.status(500).json({
//             message: 'Internal Server Error',
//             error: error.message
//         })
//     }

// }
module.exports = {
    Addfavorites,
    GetfavoritesByProduct,
    GetfavoritesByUser,
    Deletefavorites,
    // Getfavorites
}
const reviewsService = require('../services/reviewsService');

const Addreviews = async (req, res) => {
    try {
        const {
            product_id,
            user_id,
            rating,
            comment,
        } = req.body
        const obj = {
            product_id,
            user_id,
            rating,
            comment
        }
        const reviews = await reviewsService.Addreviews(obj);
        if (reviews.affectedRows === 0) {
            res.status(404).json({
                error: "Review failed to added"
            })
        }
        else {
            res.status(200).json({
                message: "Review Added",
                Data: reviews
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const GetReviewsById = async (req, res) => {
    try {
        const id = req.params.id;

        const review = await reviewsService.GetReviewsById(id);
        if (!review) {
            res.status(404).json({
                message: "No reviews found"
            });
        }

        else {
            res.status(200).json({
                message: "Get Review by id",
                Data: review
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

const GetReviewsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const review = await reviewsService.GetReviewsByUser(userId);
        if (!review) {
            res.status(404).json({
                message: "No review Found"
            })
        }
        else {
            res.status(200).json({
                message: "Review found",
                Data: review
            })
        }
    }
    catch(error){
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }

}
const GetReviewsByProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        const review = await reviewsService.GetReviewsByProduct(productId);
        if (!review) {
            res.status(404).json({
                message: "No review Found"
            })
        }
        else {
            res.status(200).json({
                message: "Review found",
                Data: review
            })
        }
    }
    catch(error){
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }

}
module.exports = {
    Addreviews,
    GetReviewsById,
    GetReviewsByUser,
    GetReviewsByProduct
}
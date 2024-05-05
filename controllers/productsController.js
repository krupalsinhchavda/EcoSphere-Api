const productsService = require('../services/productsService')

const CreateProduct = async (req, res) => {
    try {
        const { name, description, price, quantity, store_id, category } = req.body;
        const image_url = req.file ? req.file.path : null;

        const obj = {
            name,
            description,
            price,
            quantity,
            store_id,
            category,
            image_url
        }

        const Product = await productsService.CreateProduct(obj);

        if (Product && Product.affectedRows === 1) {
            res.status(201).json({
                message: "Product Created Successfully",
                Data: Product
            });
        } else {
            res.status(404).json({
                message: "Product creation failed",
                error: "No rows were affected"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }

}

const UpdateProduct = async (req, res) => {
    try {
        const { name, description, price, quantity, store_id, category, is_active } = req.body;
        const id = req.params.id;
        const obj = {
            name,
            description,
            price,
            quantity,
            store_id,
            category,
            is_active
        };
        
        const existingProduct = await productsService.GetProductByid(id);
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found",
                error: "The specified product ID does not exist"
            });
        }

        const Product = await productsService.UpdateProduct(id, obj);

        if (Product && Product.affectedRows === 1) {
            res.status(200).json({
                message: "Product Updated Successfully",
                Data: Product
            });
        } else {
            res.status(404).json({
                message: "Product update failed",
                error: "No rows were affected"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const GetAllProducts = async (req, res) => {
    try {
        const products = await productsService.GetAllProducts();

        if (products.length === 0) {
            res.status(404).json({
                message: "No products found"
            });
        } else {
            res.status(200).json({
                message: "Get All Products",
                Data: products
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const GetProductByid = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await productsService.GetProductByid(id);

        if (!product) {
            res.status(404).json({
                message: "Product not found"
            });
        } else {
            res.status(200).json({
                message: "Get Product By Id Successfully",
                Data: product
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const GetProductByStoreId = async (req, res) => {
    try {
        const id = req.params.id;

        const productOrErrorMessage = await productsService.GetProductByStoreId(id);

        if (typeof productOrErrorMessage === 'string') {
            res.status(404).json({
                message: productOrErrorMessage
            });
        } else {
            res.status(200).json({
                message: "Get Product By Store Id Successfully",
                Data: productOrErrorMessage
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const DeleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await productsService.DeleteProduct(id);

        if (!product) {
            res.status(404).json({
                message: "Product not found"
            })
        } else {
            res.status(200).json({
                message: "Get Product By Id Successfully",
                Data: product
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

module.exports = {
    CreateProduct,
    GetAllProducts,
    GetProductByid,
    DeleteProduct,
    UpdateProduct,
    GetProductByStoreId
}
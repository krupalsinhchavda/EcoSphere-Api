const ordersService = require('../services/ordersService');

const AddOrder = async (req, res) => {
    try {
        const { order_number, user_id, total_amount_tokenize, order_date, delivery_date, status, shipping_address, billing_address } = req.body;
        const order = {
            order_number,
            user_id,
            total_amount_tokenize,
            order_date,
            delivery_date,
            status,
            shipping_address,
            billing_address,
        };
        const newOrder = await ordersService.AddOrder(order, res);

        if (newOrder && newOrder.affectedRows === 0) {
            res.status(400).json({
                message: "Order Failed added",
                Data: newOrder
            })
        }
        else {
            res.status(201).json({
                message: "Order added successfully",
                Data: newOrder
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

const UpdateOrder = async (req, res) => {
    try {
        const { order_number, user_id, total_amount_tokenize, order_date, delivery_date, status, shipping_address, billing_address, is_active } = req.body;
        const id = req.params.id;
        const order = {
            order_number,
            user_id,
            total_amount_tokenize,
            order_date,
            delivery_date,
            status,
            shipping_address,
            billing_address,
            is_active
        };
        const updatedOrder = await ordersService.UpdateOrder(id, order, res);

        if (updatedOrder && updatedOrder.affectedRows === 0) {
            res.status(400).json({
                message: "Order Failed updated",
                Data: updatedOrder
            });
        }
        else {
            res.status(200).json({
                message: "Order updated successfully",
                Data: updatedOrder
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

const GetOrdersById = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await ordersService.GetOrdersById(id, );

        if (!order) {
            res.status(400).json({
                message: "Order not found",
                Data: order
            });
        }
        else {
            res.status(200).json({
                message: "Order found",
                Data: order
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}

const GetOrdersByUser = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await ordersService.GetOrdersByUser(id);

        if (!order) {
            res.status(400).json({
                message: "Order not found",
                Data: order
            });
        }
        res.status(200).json({
            message: "Order found",
            Data: order
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}

const DeleteOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await ordersService.DeleteOrder(id);

        if (!order) {
            return res.status(400).json({
                message: "Order not found",
                Data: order
            });
        }
        return res.status(200).json({
            message: "Order deleted",
            Data: order
        });
        
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}

const UpdateOrderStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const order = await ordersService.UpdateOrderStatus(id, status, res);
        if (!order) {
            res.status(400).json({
                message: "Order not found",
                Data: order
            });
        }
        res.status(200).json({
            message: "Order updated",
            Data: order
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}

const GetAllOrders = async (req, res) => {
    try {
        const orders = await ordersService.GetAllOrders();
        res.status(200).json({
            message: "Orders found",
            Data: orders
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

module.exports = {
    AddOrder,
    UpdateOrder,
    GetOrdersById,
    GetOrdersByUser,
    DeleteOrder,
    UpdateOrderStatus,
    GetAllOrders
}
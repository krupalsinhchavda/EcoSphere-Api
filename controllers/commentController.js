const commentService = require('../services/commentService');

const GetAllComments = async (req, res) => {
    try {
        const { page, limit, orderBy, orderDirection, ...filterParams } = req.query;
        const pagination = { page, limit, orderBy, orderDirection };
        const comment = await commentService.GetAllComments(pagination, filterParams);
        if (comment.length === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        return res.status(200).json({
            message: "Get comment successfully",
            data: comment
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            data: err
        })
    }
}
const GetCommentByPostId = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Validate id
        if (!id) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        const comment = await commentService.GetCommentByPostId(id);

        if (comment.length === 0) {
            return res.status(404).json({ message: 'No comments found for this post' });
        }

        return res.status(200).json({
            message: "Comments retrieved successfully",
            data: comment
        })
    }
    catch (error) {
        // Log the error for debugging purposes
        console.error('Error in GetCommentByPostId:', error);

        // Return appropriate error response
        return res.status(500).json({
            message: "Internal server error",
            data: error.message // Sending only error message for security reasons
        })
    }
}

const DeleteComment = async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await commentService.DeleteComment(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        return res.status(200).json({
            message: "Delete comment successfully",
            data: comment
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error
        })
    }
}
const CreateComment = async (req, res) => {
    try {
        const {
            content,
            user_id,
            post_id,
            comment_date,
            parent_comment_id,
            likes,
            dislikes,
        } = req.body

        const obj = {
            content,
            user_id,
            post_id,
            comment_date,
            parent_comment_id,
            likes,
            dislikes,
        };
        const comment = await commentService.CreateComment(obj);
        return res.status(201).json({
            message: "Create comment successfully",
            data: comment
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error
        })
    }
}
const UpdateComment = async (req, res) => {
    try {
        const  id  = req.params.id;
        const {
            content,
            user_id,
            post_id,
            comment_date,
            parent_comment_id,
            likes,
            dislikes,
            is_active
        } = req.body
        const obj = {
            content,
            user_id,
            post_id,
            comment_date,
            parent_comment_id,
            likes,
            dislikes,
            is_active
        };
        const comment = await commentService.UpdateComment(id, obj);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        return res.status(200).json({
            message: "Update comment successfully",
            data: comment
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error
        })
    }
}

module.exports = {
    GetAllComments,
    CreateComment,
    UpdateComment,
    DeleteComment,
    GetCommentByPostId,
}
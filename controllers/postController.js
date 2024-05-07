const postService = require('../services/postService');

const createPost = async (req, res) => {
    try {
        const { title, content, user_id, published_date, views, likes, dislikes } = req.body;
        const formdata = {
            title,
            content,
            user_id,
            published_date,
            views,
            likes,
            dislikes
        }
        const post = await postService.createPost(formdata);
        res.status(201).json({
            status: 'Post successfully Created',
            data: post
        })
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const getPost = async (req, res) => {
    try {
        const { page, limit, orderBy, orderDirection, ...filterParams } = req.query;
        const pagination = { page, limit, orderBy, orderDirection };
        const post = await postService.getPost(pagination, filterParams);

        if (post.data.length === 0) {
            return res.status(404).json({ message: "Store not found" });
        }
        res.status(200).json({
            status: 'Post successfully fetched',
            data: post
        })
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const getPostById = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await postService.getPostById(id);

        if (post.length === 0) {
            return res.status(404).json({ message: 'post not found' });
        }
        res.status(200).json({
            status: 'Post successfully fetched',
            data: post
        })

    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}
const deletePost = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await postService.deletePost(id);

        if (!post) {
            return res.status(404).json({ message: 'post not found' });
        }
        res.status(200).json({
            status: 'Post successfully deleted',
            data: post
        })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}
const updatePost = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, content, user_id, published_date, views, likes, dislikes, is_active } = req.body;
        const formdata = {
            title,
            content,
            user_id,
            published_date,
            views,
            likes,
            dislikes,
            is_active
        }
        const post = await postService.updatePost(id, formdata);

        if (!post) {
            return res.status(404).json({ message: 'post not found' });
        }
        res.status(200).json({
            status: 'Post successfully updated',
            data: post
        })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}
module.exports = {
    createPost,
    getPost,
    getPostById,
    deletePost,
    updatePost,
}
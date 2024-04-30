const storeService = require('../services/storeService');

const CreateStore = async (req, res) => {
    try {
        const { name, location, ownerId, contact_person, contact_number, opening_hours, category, website, established_year } = req.body;
        const image_url = req.file ? req.file.path : null;

        const storeData = {
            name, location, image_url, ownerId, contact_person, contact_number, opening_hours, category, website, established_year
        }
        const store = await storeService.CreateStore(storeData);

        res.status(201).json({
            message: "Store created successfully",
            data: store
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const UpdateStore = async (req, res) => {
    const id = req.params.id;
    const { name, location, ownerId, contact_person, contact_number, opening_hours, category, website, established_year, is_active } = req.body;
    const image_url = req.file ? req.file.path : null;
    const storeData = {
        id, name, location, image_url, ownerId, contact_person, contact_number, opening_hours, category, website, established_year, is_active
    }
    const UpdateStore = await storeService.UpdateStore(storeData);

    if (UpdateStore.data.length === 0) {
        return res.status(404).json({ message: "Store not found" });
    }
    res.status(200).json({ message: "Update Store Successfully", UpdateStore });
}
const DeleteStore = async (req, res) => {
    try {
        const id = req.params.id
        const DeleteStore = await storeService.DeleteStore(id);

        res.status(200).json({ message: "Delete Store Successfully", DeleteStore });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const GetStore = async (req, res) => {
    try {
        const { page, limit, orderBy, orderDirection, ...filterParams } = req.body;
        const pagination = { page, limit, orderBy, orderDirection };
        const store = await storeService.GetStore(pagination, filterParams);

        if (store.data.length === 0) {
            return res.status(404).json({ message: "Store not found" });
        }

        res.status(200).json({ store });
    } catch { }
}
const GetStoreByID = async (req, res) => {
    try {
        const id = req.params.id;
        const store = await storeService.GetStoreByID(id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }
        res.status(200).json({ store });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = { CreateStore, DeleteStore, GetStore, GetStoreByID, UpdateStore }
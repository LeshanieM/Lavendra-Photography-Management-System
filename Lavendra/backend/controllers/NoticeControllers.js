import Notice from "../models/NoticeModel.js";

// Data Display
export const getAllNotices = async (req, res, next) => {
    try {
        const notices = await Notice.find();
        
        if (!notices || notices.length === 0) {
            return res.status(404).json({ message: "No notices found" });
        }
        
        return res.status(200).json({ notices });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error while fetching notices" });
    }
};

// Data Insert
export const addNotices = async (req, res, next) => {
    const { noticeID, notice_title, posted_date, notice } = req.body;

    try {
        const newNotice = new Notice({ 
            noticeID, 
            notice_title, 
            posted_date, 
            notice 
        });
        
        const savedNotice = await newNotice.save();
        
        if (!savedNotice) {
            return res.status(400).json({ message: "Unable to add notice" });
        }
        
        return res.status(201).json({ notice: savedNotice });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error while adding notice" });
    }
};

// Get by Id
export const getById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const notice = await Notice.findById(id);
        
        if (!notice) {
            return res.status(404).json({ message: "Notice not found" });
        }
        
        return res.status(200).json({ notice });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error while fetching notice" });
    }
};

// Update notice details
export const updateNotice = async (req, res, next) => {
    const { id } = req.params;
    const { noticeID, notice_title, posted_date, notice } = req.body;

    try {
        const updatedNotice = await Notice.findByIdAndUpdate(
            id,
            { noticeID, notice_title, posted_date, notice },
            { new: true } // Return the updated document
        );
        
        if (!updatedNotice) {
            return res.status(404).json({ message: "Unable to update notice - notice not found" });
        }
        
        return res.status(200).json({ notice: updatedNotice });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error while updating notice" });
    }
};

// Delete Notice 
export const deleteNotice = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedNotice = await Notice.findByIdAndDelete(id);
        
        if (!deletedNotice) {
            return res.status(404).json({ message: "Unable to delete notice - notice not found" });
        }
        
        return res.status(200).json({ 
            message: "Notice deleted successfully",
            notice: deletedNotice 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error while deleting notice" });
    }
};

// Default export (if you want to import all controllers at once)
const noticeController = {
    getAllNotices,
    addNotices,
    getById,
    updateNotice,
    deleteNotice
};

export default noticeController;
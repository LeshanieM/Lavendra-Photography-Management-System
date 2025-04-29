import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
    title: {
        type: String, // dataType
        required: true, // validate
    },
    image: {
        type: String, // Store image URL
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    publishedDate: {
        type: Date,
        required: true,
    },
});

const BlogModel = mongoose.model("BlogModel", blogSchema);

// Default export
export default BlogModel;

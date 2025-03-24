import mongoose from 'mongoose';

/*const InquirySchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    status: { type: String, enum: ['pending', 'solved'], default: 'pending' },
    createdAt: {
        type: Date,
        default: Date.now
    }
});*/

const InquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                // Basic email validation regex
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Please enter a valid email address'
        }
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'solved'],
        default: 'pending'
    },
    inquiryType: {
        type: String,
        required: [true, 'Inquiry type is required'],
        enum: ['general', 'support', 'feedback'], // Allowed values for inquiryType
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Inquiry = mongoose.model('Inquiry', InquirySchema);
export default Inquiry;
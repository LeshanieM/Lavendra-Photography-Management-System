// models/NoticeModel.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const noticeSchema = new Schema({
  noticeID: {
    type: String,
    required: true,
  },
  notice_title: {
    type: String,
    required: true,
  },
  posted_date: {
    type: Date,
    required: true,
  },
  notice: {
    type: String,
    required: true,
  },
});

export default mongoose.model("NoticeModel", noticeSchema);

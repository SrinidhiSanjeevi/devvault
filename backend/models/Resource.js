import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  tags: [{ type: String }],
  favourite: { type: Boolean, default: false },
  folder: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;

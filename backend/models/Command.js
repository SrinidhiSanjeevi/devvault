import mongoose from 'mongoose';

const commandSchema = new mongoose.Schema({
  title: { type: String, required: true },
  command: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  tags: [{ type: String }],
  favourite: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Command = mongoose.model('Command', commandSchema);
export default Command;

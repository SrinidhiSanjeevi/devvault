import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  topic: { type: String, required: true },
  tags: [{ type: String }],
  favourite: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
export default Note;

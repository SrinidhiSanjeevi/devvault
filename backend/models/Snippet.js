import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  programmingLanguage: { type: String, required: true },
  snippetCode: { type: String, required: true },
  notes: { type: String },
  tags: [{ type: String }],
  favourite: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Snippet = mongoose.model('Snippet', snippetSchema);
export default Snippet;

import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
};

export const createNote = async (req, res) => {
  const { title, content, topic, tags, favourite } = req.body;
  
  const newNote = new Note({
    title, content, topic, tags, favourite, user: req.user._id
  });

  const createdNote = await newNote.save();
  res.status(201).json(createdNote);
};

export const updateNote = async (req, res) => {
  const { title, content, topic, tags, favourite } = req.body;
  const note = await Note.findById(req.params.id);

  if (note && note.user.toString() === req.user._id.toString()) {
    note.title = title || note.title;
    note.content = content || note.content;
    note.topic = topic || note.topic;
    note.tags = tags || note.tags;
    note.favourite = favourite !== undefined ? favourite : note.favourite;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error('Note not found or unauthorized');
  }
};

export const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.user.toString() === req.user._id.toString()) {
    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } else {
    res.status(404);
    throw new Error('Note not found or unauthorized');
  }
};

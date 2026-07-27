import Snippet from '../models/Snippet.js';

export const getSnippets = async (req, res) => {
  const snippets = await Snippet.find({ user: req.user._id });
  res.json(snippets);
};

export const createSnippet = async (req, res) => {
  const { title, description, category, programmingLanguage, snippetCode, notes, tags, favourite } = req.body;
  
  const snippet = new Snippet({
    title, description, category, programmingLanguage, snippetCode, notes, tags, favourite, user: req.user._id
  });

  const createdSnippet = await snippet.save();
  res.status(201).json(createdSnippet);
};

export const updateSnippet = async (req, res) => {
  const { title, description, category, programmingLanguage, snippetCode, notes, tags, favourite } = req.body;
  const snippet = await Snippet.findById(req.params.id);

  if (snippet && snippet.user.toString() === req.user._id.toString()) {
    snippet.title = title || snippet.title;
    snippet.description = description || snippet.description;
    snippet.category = category || snippet.category;
    snippet.programmingLanguage = programmingLanguage || snippet.programmingLanguage;
    snippet.snippetCode = snippetCode || snippet.snippetCode;
    snippet.notes = notes || snippet.notes;
    snippet.tags = tags || snippet.tags;
    snippet.favourite = favourite !== undefined ? favourite : snippet.favourite;

    const updatedSnippet = await snippet.save();
    res.json(updatedSnippet);
  } else {
    res.status(404);
    throw new Error('Snippet not found or unauthorized');
  }
};

export const deleteSnippet = async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);

  if (snippet && snippet.user.toString() === req.user._id.toString()) {
    await snippet.deleteOne();
    res.json({ message: 'Snippet removed' });
  } else {
    res.status(404);
    throw new Error('Snippet not found or unauthorized');
  }
};

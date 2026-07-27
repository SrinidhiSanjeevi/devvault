import Resource from '../models/Resource.js';

export const getResources = async (req, res) => {
  const resources = await Resource.find({ user: req.user._id });
  res.json(resources);
};

export const createResource = async (req, res) => {
  const { title, url, description, category, tags, favourite, folder } = req.body;
  
  const resource = new Resource({
    title, url, description, category, tags, favourite, folder, user: req.user._id
  });

  const createdResource = await resource.save();
  res.status(201).json(createdResource);
};

export const updateResource = async (req, res) => {
  const { title, url, description, category, tags, favourite, folder } = req.body;
  const resource = await Resource.findById(req.params.id);

  if (resource && resource.user.toString() === req.user._id.toString()) {
    resource.title = title || resource.title;
    resource.url = url || resource.url;
    resource.description = description || resource.description;
    resource.category = category || resource.category;
    resource.tags = tags || resource.tags;
    resource.favourite = favourite !== undefined ? favourite : resource.favourite;
    resource.folder = folder || resource.folder;

    const updatedResource = await resource.save();
    res.json(updatedResource);
  } else {
    res.status(404);
    throw new Error('Resource not found or unauthorized');
  }
};

export const deleteResource = async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (resource && resource.user.toString() === req.user._id.toString()) {
    await resource.deleteOne();
    res.json({ message: 'Resource removed' });
  } else {
    res.status(404);
    throw new Error('Resource not found or unauthorized');
  }
};

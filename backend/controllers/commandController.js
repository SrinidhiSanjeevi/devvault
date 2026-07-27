import Command from '../models/Command.js';

export const getCommands = async (req, res) => {
  const commands = await Command.find({ user: req.user._id });
  res.json(commands);
};

export const createCommand = async (req, res) => {
  const { title, command, description, category, tags, favourite } = req.body;
  
  const newCommand = new Command({
    title, command, description, category, tags, favourite, user: req.user._id
  });

  const createdCommand = await newCommand.save();
  res.status(201).json(createdCommand);
};

export const updateCommand = async (req, res) => {
  const { title, command, description, category, tags, favourite } = req.body;
  const cmd = await Command.findById(req.params.id);

  if (cmd && cmd.user.toString() === req.user._id.toString()) {
    cmd.title = title || cmd.title;
    cmd.command = command || cmd.command;
    cmd.description = description || cmd.description;
    cmd.category = category || cmd.category;
    cmd.tags = tags || cmd.tags;
    cmd.favourite = favourite !== undefined ? favourite : cmd.favourite;

    const updatedCommand = await cmd.save();
    res.json(updatedCommand);
  } else {
    res.status(404);
    throw new Error('Command not found or unauthorized');
  }
};

export const deleteCommand = async (req, res) => {
  const cmd = await Command.findById(req.params.id);

  if (cmd && cmd.user.toString() === req.user._id.toString()) {
    await cmd.deleteOne();
    res.json({ message: 'Command removed' });
  } else {
    res.status(404);
    throw new Error('Command not found or unauthorized');
  }
};

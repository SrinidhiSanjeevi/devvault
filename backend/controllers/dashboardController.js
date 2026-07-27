import Snippet from '../models/Snippet.js';
import Resource from '../models/Resource.js';
import Command from '../models/Command.js';

export const getDashboardStats = async (req, res) => {
  const userId = req.user._id;

  const totalSnippets = await Snippet.countDocuments({ user: userId });
  const totalResources = await Resource.countDocuments({ user: userId });
  const totalCommands = await Command.countDocuments({ user: userId });

  const favouriteSnippets = await Snippet.countDocuments({ user: userId, favourite: true });
  const favouriteResources = await Resource.countDocuments({ user: userId, favourite: true });
  const favouriteCommands = await Command.countDocuments({ user: userId, favourite: true });

  const recentSnippets = await Snippet.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
  const recentResources = await Resource.find({ user: userId }).sort({ createdAt: -1 }).limit(5);

  const categoryStats = await Snippet.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  res.json({
    totals: {
      snippets: totalSnippets,
      resources: totalResources,
      commands: totalCommands
    },
    favourites: {
      snippets: favouriteSnippets,
      resources: favouriteResources,
      commands: favouriteCommands
    },
    recent: {
      snippets: recentSnippets,
      resources: recentResources
    },
    categoryStats
  });
};

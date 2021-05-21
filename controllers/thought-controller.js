const { Thought, User } = require('../models');

const thoughtController = {

    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'users',
            select: '-__v'
        })
        .select('-__v')
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: 'users',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    createThought({ params, body }, res) {
        Thought.create(body)
            .then(dbThoughtData => {
                User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: dbThoughtData._id } },
                    { new: true }
                )
                    .then(dbThoughtData => {
                        if (!dbThoughtData) {
                            res.status(404).json({ message: 'No thought found with that id!' });
                            return;
                        }
                        res.json(dbThoughtData);
                    })
                    .catch(err => res.json(err));
            })
            .catch(err => res.status(400).json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findByIdAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
        })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id' });
            return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id.' });
            return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.json(err));
    },

    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { _id: params.reactionId } } },
        { new: true }
        )
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => res.json(err));
    },
};

module.exports = thoughtController;
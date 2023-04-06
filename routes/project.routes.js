const router = require('express').Router();
const Project = require('../models/Projects.model');
const fileUploader = require('../config/cloudinary.config');
const bcrypt = require('bcryptjs');

router.get('/', (req, res, next) => {
	Project.find()
		.then((response) => {
			res.json({ response });
		})
		.catch((err) => next(err));
});

router.get('/:projId', (req, res, next) => {
	const { projId } = req.params;
	Project.findById(projId)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => next(err));
});

router.post('/upload', fileUploader.single('image'), (req, res, next) => {
	if (!req.file) {
		next(new Error('No file selected'));
		return;
	}
	res.json({ imageUrl: req.file.path });
});

router.post('/new', (req, res, next) => {
	const { title, description, secDescription, technologies, urlGit, image, ownCode } = req.body;
	if (!bcrypt.compareSync(ownCode, process.env.CRYPTCODE)) {
		res.json({ messageError: 'Your Owner Code is not correct !' });
		return;
	}
	Project.create({ title, description, secDescription, technologies, urlGit, image })
		.then((response) => {
			res.json({ response: 'Created !' });
		})
		.catch((err) => console.log('paso esto', err));
});

router.put('/:projId/edit', (req, res, next) => {
	const { projId } = req.params;
	const { title, description, secDescription, technologies, urlGit, image, ownCode } = req.body;
	if (!bcrypt.compareSync(ownCode, process.env.CRYPTCODE)) {
		res.json({ messageError: 'Your Owner Code is not correct !' });
		return;
	}
	Project.findByIdAndUpdate(
		projId,
		{ title, description, secDescription, technologies, urlGit, image },
		{ new: true }
	)
		.then((result) => {
			res.json(result.data);
		})
		.catch((err) => next(err));
});

router.delete('/:projId/delete', (req, res, next) => {
	const { projId } = req.params;
	const { ownCode } = req.body;
	if (!bcrypt.compareSync(ownCode, process.env.CRYPTCODE)) {
		res.json({ messageError: 'Your Owner Code is not correct' });
		return;
	}
	Project.findByIdAndDelete(projId)
		.then((result) => {
			res.json({ message: `Project was deleted` });
		})
		.catch((err) => next(err));
});

module.exports = router;

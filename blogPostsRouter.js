const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./models');

BlogPosts.create('Blog Post 1', 
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam varius in nulla sed egestas. Aliquam tincidunt sagittis tempor. Ut leo est,'
	+ ' rta et turpis non, molestie vestibulum mi. Sed ut massa ante. Vestibulum dignissim eleifend quam aliquam sodales. Aliquam quis lectus feugiat felis vestibulum'
	+ ' maximus. Aenean maximus tellus vitae tortor condimentum placerat. Phasellus tempus faucibus tellus id pulvinar. Nulla laoreet massa id magna ultrices dignissim.'
	+ ' Sed fermentum posuere magna nec suscipit. Suspendisse neque purus, blandit id neque et, posuere facilisis enim. Integer nec euismod tortor, convallis facilisis ante.'
	+ ' Vivamus tempor dui vitae magna sagittis tempor. In vel ligula urna.',
	'John Doe',
	'11/18/14');
BlogPosts.create('Blog Post 2', 
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu iaculis purus. Curabitur in lacinia dui. Maecenas tincidunt elit eu libero tempor suscipit vel nec'
	+ ' lectus. Nullam nisl nulla, faucibus eu egestas in, suscipit eu neque. Donec malesuada felis eget libero eleifend fringilla. Mauris commodo quam velit, quis'
	+ ' vestibulum orci ultricies non. Nulla non eros dolor. Aenean cursus arcu at lectus ultrices ultrices. Etiam vitae viverra lectus. Integer semper nisl a posuere'
	+ ' ultrices.',
	'John Doe',
	'11/18/14');

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
	return res.status(200);
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`{field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(post);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post \`${req.params.id}\``);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = (`Request path id ${req.params.id} and request body id`
		+ ` ${req.body.id} must match`);
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog post \`${req.params.id}\``);
		const updatedPost = BlogPosts.update({
			id: req.params.id,
			title: req.body.title,
			content: req.body.content,
			author: req.body.author,
			publishDate: req.body.publishDate
		});
		res.status(204).end();
})

module.exports = router;
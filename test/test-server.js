const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server.js');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function() {
	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	});
	it('should list blog entries on GET', function() {
		return chai
			.request(app)
			.get('/blog-posts')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
				expect(res.body.length).to.be.at.least(1);
				const expectedKeys = [
				'title',
				'content',
				'author'
				];
				res.body.forEach(function(post) {
					expect(post).to.be.a('object');
					expect(post).to.include.keys(expectedKeys);
				});
			});
	});
	it('should add a blog entry on POST', function() {
		const newBlogPost = {
			title: 'New Blog Post',
			content: 'New Blog Content',
			author: 'Blog Author'
		};
		const expectedKeys = [
		'title',
		'content',
		'author'
		];
		return chai
			.request(app)
			.post('/blog-posts')
			.send(newBlogPost)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys(expectedKeys);
				expect(res.body.id).to.not.equal(null);
			});
	});
	it('should update blog entries on PUT', function() {
		const updateBlogPost = {
			title: 'New Blog Post',
			content: 'New Blog Content',
			author: 'Blog Author'
		};
		return chai
			.request(app)
			.get('/blog-posts')
			.then(function(res) {
				updateBlogPost.id = res.body[0].id;
				return chai
					.request(app)
					.put(`/blog-posts/${updateBlogPost.id}`)
					.send(updateBlogPost);
			})
			.then(function(res) {
				expect(res).to.have.status(204);
			})
	});
it('should delete blog entries on DELETE', function() {
	return chai
		.request(app)
		.get('/blog-posts')
		.then(function(res) {
			return chai
				.request(app)
				.delete(`/blog-posts/${res.body[0].id}`);
		})
		.then(function(res) {
			expect(res).to.have.status(204);
		})
	});
});
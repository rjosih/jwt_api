module.exports = (app) => {
	require('./webhook')(app, '/webhook/')
	require('./apiRoutes')(app, '/apiRoutes/')
}
module.exports = (app) => {
	// Second parameter is the base route.
	require('./webhook')(app, '/webhook/')
	require('./apiRoutes')(app, '/apiRoutes/')
}
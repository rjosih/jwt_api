module.exports = (server) => {
	// Second parameter is the base route.
	require('./apiRoutes')(server, '/apiRoutes/')
	require('./webhook')(server, '/webhook/')
}
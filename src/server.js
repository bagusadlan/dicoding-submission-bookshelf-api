const Hapi = require('@hapi/hapi')

const routes = require('./routes')

const init = async () => {
  const server = Hapi.server({
    port: 9000,
		host: process.env.ENV_NODEn = 'development' ? 'localhost' : '0.0.0.0',
		routes: {
			cors: {
				origin: ['*']
			}
		}
	})

	server.route(routes)
	await server.start()
	console.log(`server running on ${server.info.uri}`)
}

init()
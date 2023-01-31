const { gql, GraphqlClientFactory } = require('@pantheon-systems/wordpress-kit')

const wpGraphqlEndpoint =
	process.env.WPGRAPHQL_URL || process.env.PANTHEON_CMS_ENDPOINT

const client = new GraphqlClientFactory(wpGraphqlEndpoint).create()

async function privatePostsQuery() {
	const credentials = `${process.env.WP_APPLICATION_USERNAME}:${process.env.WP_APPLICATION_PASSWORD}`
	const encodedCredentials = Buffer.from(credentials, 'binary').toString(
		'base64',
	)
	client.setHeader('Authorization', `Basic ${encodedCredentials}`)

	const query = gql`
		query LatestPostsQuery {
			posts(where: { status: PRIVATE }) {
				edges {
					node {
						id
					}
				}
			}
		}
	`

	const {
		posts: { edges },
	} = await client.request(query)

	return edges.map(({ node }) => node)
}

module.exports.privatePostsQuery = privatePostsQuery

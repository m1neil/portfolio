export class HttpRequest {
	static apiKey = 'live_k6cV1ipnfCVbEkY7o0QIlvo8RVjJhVPb3JdN10Q2WnYrCIn5OdK2xBgfO9PXSb19'
	static async getData(url, method = 'get', contentType = 'application/json') {
		const response = await fetch(url, {
			method,
			contentType,
			'x-api-key': this.apiKey
		})

		if (!response.ok)
			throw new Error(`Failed to get data on the URL: ${response.url}; status: ${response.status}`)

		return await response.json()
	}

	static async transformData(data, url) {
		return await Promise.all(data.map(({ id }) =>
			this.getData(`${url}/${id}`)
		))
	}
}
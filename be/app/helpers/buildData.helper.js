exports.buildParamPaging = (queryParam) => {
	return {
		page: queryParam.page || 1,
		page_size: queryParam.page_size || 10,
	}
}

exports.buildResponsePaging = (page, page_size, total) => {
	return {
		total_page: Math.ceil(total / page_size),
		total: total,
		current_page: parseInt(page),
		page_size: parseInt(page_size)
	}
}
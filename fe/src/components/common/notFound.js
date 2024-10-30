import React from "react";

import { EnvelopeAt, Map, MapFill, TelephoneFill } from 'react-bootstrap-icons';
import { NOTFOUND_IMG } from "../../common/constant";
import { Link } from "react-router-dom";

export const NotFoundPage = () =>
{
	return (
		<div className="d-block text-center mx-auto">
			<img src={ NOTFOUND_IMG } className="w-50 h-50" />
			<p className="mt-3">
				<Link to='#' className="mt-2 fs-20">Không tìm thấy dữ liệu</Link>

			</p>
		</div>
	);
};

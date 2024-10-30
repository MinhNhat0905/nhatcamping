import React, { useEffect, useState } from "react";
import { BlogList } from "../../components/blog/blogList";
import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { ArticleService } from "../../services/feService/articleService";
import { useParams } from "react-router";
import { menuService } from "../../services/feService/menuService";
import { BookingService } from "../../services/feService/bookingService";
import { BookingList } from "../../components/booking/bookingList";
import { useSearchParams } from "react-router-dom";
import { getUser } from "../../common/helper";
import { INIT_PAGING } from "../../common/constant";

export const BookingPage = () =>
{
	document.title = 'Lịch sử đặt phòng';

	const [ data, setData ] = useState( [] );
	const [title, setTitle] = useState('Lịch sử đặt phòng');
	const [ paging, setPaging ] = useState( INIT_PAGING );
	const [ params, setParams ] = useState( {
		status: null,
		room_id: null,
		check_in: null,
		check_out: null
	} );

	const paramQuery = useParams();
	let [ searchParams, setSearchParams ] = useSearchParams( {} );

	const [showModal, setShowModal] = useState(false);
	const [id, setId] = useState(null);

	const dispatch = useDispatch();
	useEffect( () =>
	{
		getDataList( { page: 1, page_size: INIT_PAGING.page_size } );
	}, [] );

	const getDataList = async ( params ) =>
	{

		dispatch( toggleShowLoading( true ) );
		let user = getUser();
		const rs = await BookingService.getDataList( {...params, user_id: user._id}, true, setSearchParams );
		if ( rs?.status === 200 )
		{

			setData( rs?.data?.bookings || [] );
			setPaging( rs?.meta || INIT_PAGING );
		} else
		{
			setData( [] );
			setPaging( INIT_PAGING );
		}
		dispatch( toggleShowLoading( false ) );
	};
	return (
		<React.Fragment>

			<BookingList
				data={ data }
				getDataList={ getDataList }
				paging={ paging }
				params={ params }
				title={title}
				showModal={showModal}
				id={id}
				setShowModal={setShowModal}
				setId={setId}
			/>
		</React.Fragment>
	);
};


import React, { useEffect, useState } from "react";
import { ServiceList } from "../../components/room-service/serviceList";

import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { ServiceHotelService } from "../../services/feService/serviceHotel";
import { INIT_PAGING } from "../../common/constant";
import { useSearchParams } from "react-router-dom";

const ServicePage = () =>
{
	document.title = 'Booking | Service';
	const [ data, setData ] = useState( [] );
	const [ paging, setPaging ] = useState( INIT_PAGING );
	const [ params, setParams ] = useState( {
		size: null,
		bed: null
	} );
	let [ searchParams, setSearchParams ] = useSearchParams( {} );

	const dispatch = useDispatch();
	useEffect( () =>
	{
		getDataList( { page: 1, page_size: INIT_PAGING.page_size } );
		
	}, [] );

	const getDataList = async ( params ) =>
	{
		
		dispatch( toggleShowLoading( true ) );
		const rs = await ServiceHotelService.getDataList( params,true, setSearchParams );
		if ( rs?.status === 200 )
		{

			setData( rs?.data?.services || [] );
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
			<ServiceList
				data={ data }
				getDataList={ getDataList }
				paging={ paging }
				params={ params }
				setPaging={setPaging}
				setParams={setParams}
			/>

		</React.Fragment>
	);
};

export default ServicePage;

import React, { useEffect, useState } from "react";
import { BlogList } from "../../components/blog/blogList";
import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { ArticleService } from "../../services/feService/articleService";
import { useParams } from "react-router";
import { menuService } from "../../services/feService/menuService";
import { useSearchParams } from "react-router-dom";
import { INIT_PAGING } from "../../common/constant";

const BlogsPage = () =>
{
	document.title = 'menu';

	const [ data, setData ] = useState( [] );
	const [title, setTitle] = useState('Menu');
	const [ paging, setPaging ] = useState( INIT_PAGING );
	const [ params, setParams ] = useState( {
		menu_id: null
	} );

	let [ searchParams, setSearchParams ] = useSearchParams( {} );

	const paramQuery = useParams();

	const dispatch = useDispatch();
	useEffect( () =>
	{	
		getDataList( { page: 1, page_size: INIT_PAGING.page_size, menu_id: paramQuery.id } );
		if(paramQuery.id) {
			getDetail(paramQuery.id);
			setParams({...params, menu_id: paramQuery.id})
		}
	}, [paramQuery.id] );

	const getDataList = async ( params ) =>
	{
		dispatch( toggleShowLoading( true ) );
		const rs = await ArticleService.getDataList( params, true, setSearchParams );
		if ( rs?.status === 200 )
		{

			setData( rs?.data?.articles || [] );
			setPaging( rs?.meta || INIT_PAGING );
		} else
		{
			setData( [] );
			setPaging( INIT_PAGING );
		}
		dispatch( toggleShowLoading( false ) );
	};

	const getDetail = async (id) => {
		const response = await menuService.getDetailData(id);
		if(response?.status === 200) {
			setTitle(response?.data?.name || 'Menu');
		}
	}
	return (
		<React.Fragment>

			<BlogList
				data={ data }
				getDataList={ getDataList }
				paging={ paging }
				params={ params }
				title={title}
				setParams={ setParams }
				setPaging={ setPaging }
			/>
		</React.Fragment>
	);
};

export default BlogsPage;

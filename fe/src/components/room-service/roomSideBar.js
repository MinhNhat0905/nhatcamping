import React, { useEffect, useState } from "react";
import { DEFAULT_IMG } from "../../common/constant";
import { ArticleService } from "../../services/feService/articleService";
import { buildImage, customDate, onErrorImg } from "../../common/helper";
import { Link } from "react-router-dom";
import { CalendarWeek, Person } from "react-bootstrap-icons";

export const RoomSideBar = ( props ) =>
{
	const [ data, setData ] = useState( [] );

	useEffect( () =>
	{
		getDataList()
	}, [] );

	const getDataList = async ( params ) =>
	{
		const rs = await ArticleService.getDataList( { page: 1, page_size: 3 } );
		if ( rs?.status === 200 )
		{

			setData( rs?.data?.articles || [] );
		} else
		{
			setData( [] );
		}
	};
	return (
		<>
			{
				data.length > 0 &&
				<div className="sidebar-box p-3">
					<h3>Recent Blog</h3>
					{
						data.map( ( item, key ) =>
						{
							return <div key={ key }>
								<Link to={ '/menu/show/' + item._id } className="block-21 mb-4 d-flex">
									<img src={ item.avatar && buildImage( item.avatar ) || DEFAULT_IMG }
										className="blog-img mr-2"
										onError={ onErrorImg } />
									<div className="text">

										<h3 className="heading h-75">

											<Link to={ '/menu/show/' + item._id } 
											className="d-flex flex-column justify-content-between h-100">
												<span>{ item.name }</span>
												<div className="fs-13">
													<span>
														<CalendarWeek />
														{ customDate( item.created_at, 'DD-MMM-yyyy HH:mm' ) }
													</span>
													<span className="ml-2">
														<Person />
														{ item.created_by || 'Admin' }
													</span>
												</div>
											</Link>

										</h3>

									</div>
								</Link>


							</div>
						} )
					}
				</div>
			}
			{/* <div className="sidebar-box">
				<form action="#" className="search-form">
					<div className="form-group">
						<span className="icon fa fa-search"></span>
						<input type="text" className="form-control" placeholder="Type a keyword and hit enter" />
					</div>
				</form>
			</div> */}


		</>
	);
};

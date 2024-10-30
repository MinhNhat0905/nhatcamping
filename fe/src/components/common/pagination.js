import React, { useEffect, useMemo, useState } from 'react';
import { range } from '../../common/helper';


export const Pagination = (
	{
		total,
		pageSize,
		siblingCount = 1,
		page = 1,
		onPageChange,
	}
) =>
{

	const [ paginationMemo, setPaginationMemo ] = useState( [] );

	useEffect( () =>
	{
		if ( page )
		{
			let data = paginationFunc(total, pageSize, siblingCount, page) || [];
			console.log(data);
			setPaginationMemo( data);
		}
	}, [ page, total ] );

	const paginationFunc = ( total, pageSize, siblingCount, page ) => {
		const totalPageCount = Math.ceil( total / pageSize );

		// Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
		const totalPageNumbers = siblingCount + 5;

		let max = siblingCount 

		/*
		  Case 1:
		  If the number of pages is less than the page numbers we want to show in our
		  paginationComponent, we return the range [1..totalPageCount]
		*/
		if ( totalPageNumbers >= totalPageCount )
		{
			return range( 1, totalPageCount );
		}

		/*
			Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
		*/
		const leftSiblingIndex = Math.max( page - siblingCount, 1 );
		const rightSiblingIndex = Math.min(
			page + siblingCount,
			totalPageCount
		);


		/*
		  We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
		*/
		const shouldShowLeftDots = leftSiblingIndex > 2;
		const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

		const firstPageIndex = 1;

		/*
			Case 2: No left dots to show, but rights dots to be shown
		*/
		if ( !shouldShowLeftDots && shouldShowRightDots )
		{
			let leftItemCount = 3 + 2 * siblingCount;
			let leftRange = range( 1, leftItemCount );
			console.log('left range-----------> ', leftRange);
			return [ ...leftRange ];
		}

		/*
			Case 3: No right dots to show, but left dots to be shown
		*/
		if ( shouldShowLeftDots && !shouldShowRightDots )
		{

			let rightItemCount = 3 + 2 * siblingCount;
			let rightRange = range(
				totalPageCount - rightItemCount + 1,
				totalPageCount
			);
			console.log('rightRange range 2-----------> ', rightRange);
			return [ ...rightRange ];
		}

		/*
			Case 4: Both left and right dots to be shown
		*/
		if ( shouldShowLeftDots && shouldShowRightDots )
		{
			let middleRange = range( leftSiblingIndex, rightSiblingIndex );
			console.log('middleRange range 3-----------> ', middleRange);
			return [ ...middleRange ];
		}

		return [];
	};

	const onNext = () =>
	{
		onPageChange( page + 1 );
	};

	const onPrevious = () =>
	{
		onPageChange( page - 1 );
	};

	const lastPage = paginationMemo.length > 0 && paginationMemo[ paginationMemo.length - 1 ] || 0;

	return (
		<div className="row mt-5">
			{
				paginationMemo.length > 0 && total > 0 &&
				<div className="col text-center">
					<div className="block-27">
						<ul>
							{
								page > 1 &&
								<li
									onClick={ ( e ) => { onPrevious() } }
								>
									<span >&lt;</span>
								</li>
							}
							{ paginationMemo.length > 1 && paginationMemo.map( pageNumber =>
							{
								return (
									<li key={pageNumber}
										className={ `mx-2 ${ pageNumber === page ? ' active disabled ' : '' }` }
										onClick={ () =>
										{
											if ( page !== pageNumber )
											{
												onPageChange( pageNumber )
											}
										} }
									>
										<span >{ pageNumber }</span>
									</li>
								);
							} ) }
							{
								page < lastPage &&
								<li
									onClick={ ( e ) => { onNext() } }
								><span >&gt;</span></li>

							}
						</ul>
					</div>
				</div>
			}
		</div>
	);
}

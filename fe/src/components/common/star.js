import React from "react";

import { Star, StarFill } from 'react-bootstrap-icons';

export const StarIcons = ( props ) =>
{
	return (
		<div className="review">
			{
				[ ...Array( 5 ) ].map( ( item, index ) =>
				{
					if ( index < props.vote_number )
					{
						return (
							<StarFill key={ index }
								className={ `star active
							${ index > 0 ? 'ml-2' : '' }` }

							/>
						);
					}
					return (
						<Star key={ index }
							className={ `star
						${ index > 0 ? 'ml-2' : '' }` }

						/>
					);
				} )
			}
		</div>
	);
};

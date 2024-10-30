import React from 'react';
import { Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';


function Loading ( { isShowLoading } )
{
	// isShowLoading =  true;
	if ( isShowLoading )
	{
		return (
			<div className="zingLoading" id="zingLoading">
				<div className="gtWaving">
					<Spinner animation="border" variant="warning" role='status' >
						<span className="visually-hidden fs-18">
							<img src={'/logo.png'} style={{ width: "150px", height: "150px",borderRadius: "50%"}} />
							{/*Xin vui lòng chờ trong giây lát*/}
						</span>
					</Spinner>
				</div>
			</div>
		)
	}
	return null
}
const mapStateToProps = function ( state )
{
	return {
		isShowLoading: state.commonReducer.showLoading,
	}
}

export default connect( mapStateToProps )( Loading )

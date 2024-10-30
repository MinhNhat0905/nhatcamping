import React, { Suspense, useEffect, useState } from "react";
import Header from "../components/common/header";
import { Footer } from "../components/common/footer";


const LayOutPage = ( props ) =>
{

	return (
		<React.Fragment>
			<div className="main-content d-flex flex-column justify-content-between" style={ { height: '100vh' } }>
				<div className="page-content">
					<Header {...props} />
					{ props.children }
					<Footer />

				</div>
			</div>
		</React.Fragment>
	);
};

export default ( LayOutPage );

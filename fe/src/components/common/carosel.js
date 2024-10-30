import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { NavBarPage } from "./navBar";
import { Carousel } from "react-bootstrap";
import { DEFAULT_IMG, defaultA, defaultB } from "../../common/constant";
import { buildImage } from "../../common/helper";

/* Layout */


export const CarouselImg = ( props ) =>
{
	return (
		<>
			{
				props?.data &&
				<Carousel className={props.class || ''} >
					{
						props.data.map( ( item, key ) =>
						{
							return <Carousel.Item key={key}>
								<img
									className="d-block w-100"
									style={ { height: '100%' } }
									src={ item.avatar || DEFAULT_IMG }
									alt="First slide"
								/>
								<Carousel.Caption>
									<h3>{item.title || ''}</h3>
									<p>{item.content || ''}</p>
								</Carousel.Caption>
							</Carousel.Item>
						} )
					}
				</Carousel>
			}
		</>


	);
};

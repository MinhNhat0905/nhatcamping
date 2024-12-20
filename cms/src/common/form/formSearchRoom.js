import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { InputBase } from "../base-form/controlInputForm";
import { useParams } from "react-router-dom";
import { SelectBase } from "../base-form/selectForm";
import cateApi from "../../services/categoryService";

export const FormRoomSearch = ( props ) =>
{

	const [ form, setForm ] = useState( {
		size: null,
		bed: null,
		vote_number: null,
		name: null,
		price: null,
		floors: null,
	//	address: null,
		quantity: null,
		category_id: null
	} );

	const [ category_id, setCategoryId ] = useState( null );
	const [ categories, setCategories ] = useState( [] );
	const handleSubmit = async ( e ) =>
	{
		e.preventDefault();
		props.setParams( form );
		props.getDataList( { page: 1, page_size:  props.paging.page_size, ...form } );

	}

	const resetForm = () =>
	{
		setForm( {
			size: null,
			bed: null,
			vote_number: null,
			price: null,
			name: null,
			floors: null,
			//address:null,
			quantity: null,
			category_id: null
		} )
		props.setParams( {
			size: null,
			bed: null,
			vote_number: null,
			name: null,
			floors: null,
			//address:null,
			quantity:null,
			price: null,
			category_id: null
		} );
		props.getDataList( { page: 1, page_size: props.paging.page_size } );
	}


	// const getListsMenu = async () =>
	// {
	// 	const response = await cateApi.getDataList( {
	// 		page_size: 1000
	// 	} )
	// 	if ( response?.status === 'success' || response?.status === 200 )
	// 	{
	// 		setCategories( response.data.categories );
	// 	}
	// }

	const getLists = async (filters) => {
        const response = await cateApi.getLists(filters);
		console.log('cate---------> ', response);
        if (response?.status === 'success' || response?.status === 200) {
            setCategories(response.data.categories);
        }
    }

	useEffect( () =>
	{
		getLists({page_size: 1000})
	}, [] );

	return (
		<Form noValidate onSubmit={ handleSubmit }>
			<Row className="">
				<Form.Group className="mb-3 col-md-4">
					<SelectBase form={ form } setForm={ setForm } name={ 'category_id' }
						label={ 'Loại phòng: ' } data={ categories }
						key_name={ 'category_id' } required={ false } placeholder={ 'Loại phòng' }
						type={ 'text' } />
				</Form.Group>
				<Form.Group className="mb-3 col-md-4">
					<InputBase form={ form } setForm={ setForm } name={ 'name' }
						label={ 'Tên phòng: ' }
						key_name={ 'name' } required={ false } placeholder={ 'Nhập tên phòng' }
						type={ 'text' }
					/>
				</Form.Group>
				{/* <Form.Group className="mb-3 col-md-4">
					<InputBase form={ form } setForm={ setForm } name={ 'quantity' }
						label={ 'Số lượng: ' }
						key_name={ 'quantity' } required={ false } placeholder={ 'Nhập số lượng phòng' }
						type={ 'number' }
					/>
				</Form.Group> */}
				{/* <Form.Group className="mb-3 col-md-4">
					<InputBase form={ form } setForm={ setForm } name={ 'address' }
						label={ 'Địa chỉ: ' }
						key_name={ 'address' } required={ false } placeholder={ 'Nhập địa chỉ' }
						type={ 'number' }
					/>
				</Form.Group> */}

				{/* <Form.Group className="mb-3 col-md-12">
					<InputBase form={ form } setForm={ setForm } name={ 'price' }
						label={ 'Giá phòng: ' }
						key_name={ 'price' } required={ false } placeholder={ 'Nhập giá phòng' }
						type={ 'text' }
					/>
				</Form.Group>

				<Form.Group className="mb-3 col-md-12">
					<InputBase form={ form } setForm={ setForm } name={ 'size' }
						label={ 'Kích thước: ' }
						key_name={ 'size' } required={ false } placeholder={ 'Nhập kích thước' }
						type={ 'text' }
					/>
				</Form.Group>

				<Form.Group className="mb-3 col-md-12">
					<InputBase form={ form } setForm={ setForm } name={ 'bed' }
						label={ 'Phòng ngủ: ' }
						key_name={ 'bed' } required={ false } placeholder={ 'Nhập số phòng ngủ' }
						type={ 'text' }
					/>
				</Form.Group> */}

				{/* <Form.Group className="mb-3 col-md-4">
					<InputBase form={ form } setForm={ setForm } name={ 'floors' }
						label={ 'Tầng: ' }
						key_name={ 'floors' } required={ false } placeholder={ 'Nhập số tầng' }
						type={ 'number' }
					/>
				</Form.Group> */}



			</Row>

			<Form.Group className="mb-3">
				<button type="submit" className='btn btn-primary px-3 fs-14 py-2'>Tìm kiếm</button>
				<button type="button"
					onClick={ ( e ) => { resetForm() } }
					className='ms-2 px-3 fs-14 py-2 btn btn-secondary'>Reset</button>
			</Form.Group>
		</Form>
	);
};


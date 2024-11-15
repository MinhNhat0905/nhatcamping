import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { InputBase } from "../base-form/controlInputForm";
import { categoryService } from "../../services/feService/categoryService";
import { facilityService } from "../../services/feService/facilityService";
import { useParams } from "react-router-dom";
import { SelectBase } from "../base-form/selectForm";//
import { CheckboxBase } from "../base-form/checkboxForm";//
export const FormRoomSearch = ( props ) =>
{

	const [ form, setForm ] = useState( {
		size: null,
		bed: null,
		vote_number: null,
		name: null,
		price: null,
		floors: null,
		category_id: null,
    	facilities: [],
	} );

	const [ category_id, setCategoryId ] = useState( null );
	const [ categories, setCategories ] = useState( [] );
	const [facilities, setFacilities] = useState([]);
	const params = useParams();
	const handleSubmit = async ( e ) =>
	{
		e.preventDefault();
		props.setParams( form );
		props.getDataList( { page: 1, page_size: props.paging.page_size, ...form } );

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
			category_id: null,
			facilities: [],
		} )
		props.setParams( {
			size: null,
			bed: null,
			vote_number: null,
			name: null,
			floors: null,
			price: null,
			category_id: null,
			facilities: [],
		} );
		props.getDataList( { page: 1, page_size: props.paging.page_size } );
	}


	const getListsMenu = async () =>
	{
		const response = await categoryService.getDataList( {
			page_size: 1000
		} )
		if ( response?.status === 'success' || response?.status === 200 )
		{
			setCategories( response.data.categories );
		}
	};
	
	const getFacilities = async () => {
		const response = await facilityService.getDataList({
		  page_size: 1000,
		});
		if (response?.status === "success" || response?.status === 200) {
		  setFacilities(response.data.facilities); // Giả sử bạn nhận danh sách tiện nghi từ API
		}
	  };
	  
	useEffect( () =>
	{
		getListsMenu().then( r => { } );
		getFacilities();
	}, [] );

	return (
		<Form noValidate onSubmit={ handleSubmit }>
			<Row className="">
				<Form.Group className="mb-3 col-md-12">
					<SelectBase form={ form } setForm={ setForm } name={ 'category_id' }
						label={ 'Loại phòng: ' } data={ categories }
						key_name={ 'category_id' } required={ false } placeholder={ 'Loại phòng' }
						type={ 'text' } />
				</Form.Group>
				<Form.Group className="mb-3 col-md-12">
					<InputBase form={ form } setForm={ setForm } name={ 'name' }
						label={ 'Tên phòng: ' }
						key_name={ 'name' } required={ false } placeholder={ 'Nhập tên phòng' }
						type={ 'text' }
					/>
				</Form.Group>

				{/* <Form.Group className="mb-3 col-md-12">
					<InputBase form={ form } setForm={ setForm } name={ 'price' }
						label={ 'Giá phòng: ' }
						key_name={ 'price' } required={ false } placeholder={ 'Nhập giá phòng' }
						type={ 'text' }
					/>
				</Form.Group> */}

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
				</Form.Group>
 {/* Checkbox for selecting facilities */}
 <Form.Group className="mb-3 col-md-12">
  <label>Tiện nghi: </label>
  {facilities.map((facility) => (
    <CheckboxBase
      key={facility.id}
      label={facility.name}
      value={facility.id}
      form={form}
      key_name="facilities"
      setForm={setForm}
    />
  ))}
</Form.Group>
				{/* <Form.Group className="mb-3 col-md-12">
					<InputBase form={ form } setForm={ setForm } name={ 'floors' }
						label={ 'Tầng: ' }
						key_name={ 'floors' } required={ false } placeholder={ 'Nhập số tầng' }
						type={ 'number' }
					/>
				</Form.Group> */}



			</Row>

			<Form.Group className="mb-3 d-flex justify-content-center">
				<button type="submit" className='btn btn-primary px-3 fs-14 py-2'>Tìm kiếm</button>
				<button type="button"
					onClick={ ( e ) => { resetForm() } }
					className='ml-2 px-3 fs-14 py-2 btn btn-secondary'>Reset</button>
			</Form.Group>
		</Form>
	);
};


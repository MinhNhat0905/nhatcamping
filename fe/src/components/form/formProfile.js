import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { toggleShowLoading } from "../../redux/actions/common";
import { OtherService } from "../../services/feService/otherService";
import { buildImage, caculateDateTime, customDate, customNumber, getItem, getUser, readFile, setField, timeDelay } from "../../common/helper";
import { toast } from "react-toastify";
import { InputBase } from "../base-form/controlInputForm";
import { SelectBase } from "../base-form/selectForm";
import { AuthService } from "../../services/feService/authService";
import { DEFAULT_IMG } from "../../common/constant";


export const FormProfile = ( props ) =>
{

	const [ form, setForm ] = useState( {
		email: null,
		name: null,
		sex: null,
		birthday: null,
		avatar: null
	} );

	let [imgBase64, setImgBase64] = useState(null);

	let refFile = useRef(null);

	let [file, setFile] = useState();

	useEffect( () =>
	{
		if ( props.status && props.data )
		{
			let user = {
				email: props.data.email,
				name: props.data.name,
				sex: props.data.sex,
				birthday: props.data.birthday && customDate(props.data.birthday, 'yyyy-MM-DD') || null,
				avatar: props.data.avatar
			};
			setForm(user);
			setImgBase64(buildImage(user.avatar));
		}
	}, [ props.data, props.status ] );

	const [ validated, setValidated ] = useState( false );

	const dispatch = useDispatch();

	const handleSubmit = async ( e ) =>
	{
		e.preventDefault();
		if ( e?.currentTarget?.checkValidity() === false )
		{
			e.stopPropagation();
		} else
		{
			dispatch( toggleShowLoading( true ) );
			if(file) {
				const avatar = await OtherService.uploadFiles(file);
				if(avatar) {
					form.avatar = avatar;
				}
			}
			const response = await AuthService.updateProfile( form );
			if ( response?.status === 200 && response?.data )
			{

				toast( 'Cập nhật thành công!', { type: 'success', autoClose: 900 } );
				await timeDelay( 1000 );
				dispatch( toggleShowLoading( false ) )
				window.location.href =  '/account';
			} else
			{
				toast( response?.message || 'Cập nhật thất bại!', { type: 'error', autoClose: 900 } )
			}
			dispatch( toggleShowLoading( false ) )
		}

		setValidated( true );

	}


	return (
		<Form className="user-form" noValidate validated={ validated } onSubmit={ handleSubmit }>
			<Row>
				<Form.Group className="mb-3 col-12">
					<img src={imgBase64 || DEFAULT_IMG} className="avatar d-flex mx-auto cursor-pointer" onClick={
						e => {
							if(refFile?.current) refFile.current.click();
						}
					} />
					<Form.Control ref={refFile} type="file" accept="image/*" 
					className="d-none" onChange={e => {
						if(e?.target?.files) {
							readFile(e?.target?.files[0], setFile, setImgBase64)
						}
					}}/>
				</Form.Group>

				<Form.Group className="mb-3 col-xl-12">
					<Form.Label>Email: </Form.Label>
					<Form.Control type="email" name={ 'email' } placeholder="Nhập email" readOnly
						value={ form.email || '' } />

				</Form.Group>

				<Form.Group className="mb-3 col-xl-12">
					<InputBase form={ form } setForm={ setForm } name={ 'name' }
						label={ 'Họ và tên: ' }
						key_name={ 'name' } required={ true } placeholder={ 'Nhập họ và tên' }
						type={ 'text' } error={ 'Họ và tên không được để trống.' }
					/>
				</Form.Group>

				<Form.Group className="mb-3 col-xl-12">
					<InputBase form={ form } setForm={ setForm } name={ 'birthday' }
						label={ 'Date of birth: ' }
						key_name={ 'birthday' } required={ false } placeholder={ 'Chọn ngày sinh' }
						type={ 'date' }
					/>
				</Form.Group>

				<Form.Group className="mb-3 col-xl-12">
					<InputBase form={ form } setForm={ setForm } name={ 'sex' }
						label={ 'Giới tính: ' }
						key_name={ 'sex' } required={ true } placeholder={ 'Nhập giới tính' }
						type={ 'text' } error={ 'Giới tính không được để trống.' }
					/>
				</Form.Group>
			</Row>


			<Form.Group className="mb-3 d-flex justify-content-center">
				<Button type="submit" size="sm" className='btn btn-primary px-5 fs-18 py-4'>Cập nhật</Button>
			</Form.Group>
		</Form>
	);
};


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


export const FormChangePass = ( props ) =>
{

	const [ form, setForm ] = useState( {
		old_password: null,
		new_password: null,
		confirm_password: null
	} );

	const [ error, setError ] = useState( '' );



	useEffect( () =>
	{
		if ( form.confirm_password && form.new_password )
		{
			if(form.confirm_password !== form.new_password) {
				setError('Mật khẩu không trùng khớp')
			} else {
				setError('')
			}
		} else {
			setError('')
		}
	}, [ form.confirm_password, form.new_password ] );

	const [ validated, setValidated ] = useState( false );

	const dispatch = useDispatch();

	const handleSubmit = async ( e ) =>
	{
		e.preventDefault();
		if ( e?.currentTarget?.checkValidity() === false || error )
		{
			e.stopPropagation();
		} else
		{
			dispatch( toggleShowLoading( true ) );

			const response = await AuthService.changePassword( form );
			if ( response?.status === 200 && response?.data )
			{

				toast( 'Cập nhật thành công!', { type: 'success', autoClose: 900 } );
				await timeDelay( 1000 );
				dispatch( toggleShowLoading( false ) )
				window.location.href = '/account';
			} else
			{
				toast( response?.message || 'Cập nhật thất bại!', { type: 'error', autoClose: 900 } )
			}
			dispatch( toggleShowLoading( false ) )
		}

		setValidated( true );

	}


	return (
		<Form noValidate validated={ validated } onSubmit={ handleSubmit }>
			<Row>
				<Form.Group className="mb-3 col-xl-12">
					<InputBase form={ form } setForm={ setForm } name={ 'old_password' }
						label={ 'Mật khẩu cũ: ' }
						key_name={ 'old_password' } required={ true } placeholder={ 'Nhập mật khẩu cũ' }
						type={ 'password' } error={ 'Mật khẩu không được để trống.' }
					/>
				</Form.Group>

				<Form.Group className="mb-3 col-xl-12">
					<InputBase form={ form } setForm={ setForm } name={ 'new_password' }
						label={ 'Mật khẩu mới: ' }
						key_name={ 'new_password' } required={ true } placeholder={ 'Nhập mật khẩu mới' }
						type={ 'password' } error={ 'Mật khẩu không được để trống.' }
					/>
				</Form.Group>

				<Form.Group className="mb-3 col-xl-12">
					<InputBase form={ form } setForm={ setForm } name={ 'confirm_password' }
						label={ 'Xác nhận mật khẩu: ' }
						key_name={ 'confirm_password' } required={ true } placeholder={ 'Xác nhận mật khẩu' }
						type={ 'password' } error={ 'Mật khẩu không được để trống.' }
					/>
				</Form.Group>
				{

					error && <p className="text-danger"> { error }</p>
				}
			</Row>

			<Form.Group className="mb-3 d-flex justify-content-center">
				<Button type="submit" size="sm" className='btn btn-primary px-5 fs-18 py-4'>Cập nhật</Button>
			</Form.Group>
		</Form>
	);
};


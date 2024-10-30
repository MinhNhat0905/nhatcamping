import React, {useEffect, useState} from 'react';
import { Breadcrumb, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import articleApi from '../../services/articleService';
import { useNavigate } from 'react-router-dom';
import uploadApi from '../../services/uploadService';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import menuApi from "../../services/menuService";

export default function CreateArticle ()
{

	const [ validated, setValidated ] = useState( false );
	const [ name, setName ] = useState( '' );
	const [ description, setDescription ] = useState( '' );
	const [ avatar, setAvatar ] = useState( '' );
	const [ article_content, setArticleContent ] = useState( '' );
	const [menu_id, setMenuId] = useState(null);
	const [menus, setMenus] = useState([]);
	const [ file, setFile ] = useState(null);
	const [params, setParams] = useState({});
	const navigate = useNavigate();
	const handleSubmit = async ( event ) =>
	{
		event.preventDefault();
		const form = event.currentTarget;
		if ( form.checkValidity() === false )
		{
			event.stopPropagation();
		} else
		{

			let data = {
				name: name,
				description: description,
				avatar: null,
				article_content: article_content,
				menu_id: menu_id,
			}
			if (file)
			{
				const avatarUpload = await uploadApi.uploadFile( file );
				if ( avatarUpload ) data.avatar = avatarUpload;
			}

			const response = await articleApi.createArticle( data );
			if ( response?.status === 'success' || response?.status === 200 )
			{
				toast( "Thêm mới thành công" );
				navigate( '/article' )
			} else
			{
				toast( response?.message || response?.error || 'error' );
			}
		}

		setValidated( true );
	};

	const getListsMenu = async () => {
		const response = await menuApi.getLists({
			page_size: 1000
		})
		if (response?.status === 'success' || response?.status === 200) {
			setMenus(response.data.menus);
		}
	}

	const handleUpload = ( event ) =>
	{
		if ( event && event.target.files[ 0 ] ) setFile( event.target.files[ 0 ] );
	}

	const handleChangeMenu = (event) => {
		setMenuId(event.target.value);
	}

	useEffect(() => {
		getListsMenu({...params}).then(r =>{});
	}, []);

	return (
		<div>
			<Container>
				<Row>
					<Col>
						<Breadcrumb>
							<Breadcrumb.Item href="/article" >
								Tin tức
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Thêm mới</Breadcrumb.Item>
						</Breadcrumb>
						<div className={ 'd-flex justify-content-end' }>
							<Link className={ 'btn btn-sm btn-primary' } to={ '/article' } >Trở về</Link>
						</div>
						<Form noValidate validated={ validated } onSubmit={ handleSubmit }>
							<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
								<Form.Label>Tên bài viết</Form.Label>
								<Form.Control required type="text" name={ 'name' } placeholder="3 Lợi ích khi đi du lịch nghỉ dưỡng gia đình không thể không mê"
									onChange={ event => setName( event.target.value ) }
									value={ name } />
								<Form.Control.Feedback type="invalid">
									Tên bài viết không được để trống
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
								<Form.Label>Mô tả ( 180 ký tự )</Form.Label>
								<Form.Control as="textarea" name={ "description" } rows={ 2 }
									placeholder={ ' Cùng Sun camping khám phá những lợi ích khi đi camping' }
									onChange={ event => setDescription( event.target.value ) }
									value={ description }
								/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
								<Form.Label>Menu</Form.Label>
								<Form.Select required aria-label="Default select example" onChange={handleChangeMenu}>
									<option value="">-- Mời chọn menu --</option>
									{ menus.map((item, index) => {
										return (
											<option value={item._id}>{item.name}</option>
										)
									})}
								</Form.Select>
								<Form.Control.Feedback type="invalid">
									Menu không được để trống
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group controlId="formFile" className="mb-3">
								<Form.Label>Avatar</Form.Label>
								<Form.Control type="file" accept="image/*" onChange={ ( event ) => handleUpload( event ) } />
							</Form.Group>
							<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
								<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
									<Form.Label>Nội dung</Form.Label>
									<CKEditor
										editor={ ClassicEditor}
										data={ article_content }
										onChange={ ( event, editor ) =>
										{
											setArticleContent( editor?.getData() || '' )
										} }

										onBlur={ ( event, editor ) =>
										{
											setArticleContent( editor?.getData() || '' )
										} }
									/>
								</Form.Group>
							</Form.Group>
							<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
								<Button type="submit">Lưu dữ liệu</Button>
							</Form.Group>
						</Form>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

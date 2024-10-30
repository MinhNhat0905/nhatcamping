export const buildFilter = ( values ) =>
{
	delete values.total;
	delete values.total_page;
	let params = {};
	if ( values )
	{
		let arrCondition = Object.entries( values );

		params = arrCondition.reduce( ( param, item ) =>
		{
			if ( item[ 1 ] != null )
			{
				param = { ...param, ...buildItemParam( item[ 0 ], item[ 1 ], param ) }
			}
			return param;
		}, {} );
	}
	return params;
}

export const buildItemParam = ( key, value, params ) =>
{
	if ( key == 'page' && !value )
	{
		params[ 'page' ] = value;
	} else if ( value != null )
	{
		params[ `${ key }` ] = value;
	}
	return params;
}

export const setItem = ( key, value ) =>
{
	localStorage.setItem( key, value );
}

export const getItem = (key) => {
	return localStorage.getItem(key) || null;
}

export const removeItem = (key) => {
	localStorage.removeItem(key);
}

export const timeDelay = async (delay) => {
	return new Promise(res => setTimeout(res, delay))
}

export const setField = (form,field, value, setForm) => {
	setForm({
		...form,
		[field]: value
	});
};

export const validateMessages = {
	required: '${label} is required!',
	types: {
		email: '${label} is not a valid email!',
		number: '${label} is not a valid number!',
	},
	number: {
		range: '${label} must be between ${min} and ${max}',
	},
};

export const toSlug = ( str, space = '-' ) =>
{
	// Chuyển hết sang chữ thường
	if ( str )
	{
		str = str.toLowerCase();

		// xóa dấu
		str = str
			.normalize( 'NFD' ) // chuyển chuỗi sang unicode tổ hợp
			.replace( /[\u0300-\u036f]/g, '' ); // xóa các ký tự dấu sau khi tách tổ hợp

		// Thay ký tự đĐ
		str = str.replace( /[đĐ]/g, 'd' );

		// Xóa ký tự đặc biệt
		str = str.replace( /([^0-9a-z-\s])/g, '' );

		// Xóa khoảng trắng thay bằng ký tự -
		str = str.replace( /(\s+)/g, space );

		// Xóa ký tự - liên tiếp
		str = str.replace( /-+/g, space );

		// xóa phần dư - ở đầu & cuối
		str = str.replace( /^-+|-+$/g, '' );
	}


	// return
	return str;
}

export const resetForm = (form) =>
{
	form.resetFields();
}

export const onFieldsChange = ( e, form, setIsTeacher ) =>
{
	if ( e.length > 0 )
	{
		let value = typeof e[ 0 ].value === 'string' ? e[ 0 ].value : e[ 0 ].value;
		if ( e[ 0 ].name[ 0 ] === 'name' && value != '' )
		{
			let slug = toSlug( value );
			form.setFieldsValue( { code: slug } );
		}
		if(e[0].name[0] === 'role' && value === 2) {
			setIsTeacher(true)
		}
		let fieldValue = {
			[ String( e[ 0 ].name[ 0 ] ) ]: value
		}
		form.setFieldsValue( fieldValue );
	}
}

export const normFile = ( e, setFiles ) =>
{
	if ( e?.fileList )
	{
		let fileChoose = e?.fileList.map( item => {
			if(item.default) return item;
			item.status = 'done';
			return item;
		} );
		setFiles( fileChoose );
	}
	return e?.fileList;
}


export const statusConfig = [
	{ id: 0, value: 'Inactive' },
	{ id: 1, value: 'Active' }
];

export const genStatusClass = ( status ) =>
{
	if ( status )
	{
		let nameStatus = statusConfig.find( ( item ) => item.id === status );
		switch ( status )
		{
			case 1:
				return (
					<span className='text-success'>
						{ nameStatus?.value || 'N/A' }
					</span>
				);
			default: return (
				<span className='text-danger'>
					{ nameStatus?.value || 'N/A' }
				</span>
			);
		}
	}
	return (
		<span className='text-danger'>
			{ 'Inactive' }
		</span>
	);
}

export const checkLogin = () => {
	return getItem('access_token') || false
}

// export const DEFAULT_IMG =  require( "assets/img/default-avatar.png" )
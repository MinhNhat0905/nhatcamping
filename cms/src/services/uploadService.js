import axios from "axios";
import axiosClient from "./axiosClient";

const uploadApi = {

	async getFile ( path )
	{
		try
		{

		} catch ( error )
		{

		}
		return await axiosClient.get( `uploads/${ path }` );
	},

	async uploadFile ( files )
	{
		let avatar = null;
		try
		{
			const formData = new FormData();
			formData.append( 'file', files );
			const res = await axios.post( `${ process.env.REACT_APP_URL_API }upload-avatar`,
				formData, { headers: { 'Accept': 'multipart/form-data' } } );
			if ( res.status === 200 )
			{
				avatar = res.data.data.filename;
			}
		} catch ( error )
		{
		}
		return avatar;

	},

	async uploadMultiImg ( files )
	{
		let albums = [];
		try
		{
			for ( let item of files )
			{
				if ( item.file )
				{
					const formData = new FormData();
					formData.append( 'file', item.file );
					const res = await axios.post( `${ process.env.REACT_APP_URL_API }upload-avatar`,
						formData, { headers: { 'Accept': 'multipart/form-data' } } );
					if ( res.status === 200 )
					{
						albums.push( res.data.data.filename );
					}
				}

			}

		} catch ( error )
		{
		}
		return albums;

	},
}

export default uploadApi;

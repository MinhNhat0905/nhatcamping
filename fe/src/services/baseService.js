import axios from 'axios';
import { timeDelay } from '../common/helper';

const axiosClient = axios.create( {
	baseURL: process.env.REACT_APP_URL_API,
	headers: {
		'Content-Type': 'application/json',
	},
} )

if ( localStorage.getItem( 'access_token' ) )
{
	axiosClient.defaults.headers.common[ 'x_authorization' ] = localStorage.getItem( 'access_token' );
}

axiosClient.interceptors.response.use(
	async ( response ) =>
	{
		let data = response.data;
		await timeDelay( 1000 );

		if ( ( data && data.code === 'LG0401' ) )
		{
			localStorage.clear();
			window.location.href = `/`;
			console.log( 401 );
		} else if ( data.code === 'LG0403' )
		{
			localStorage.clear();
			window.location.href = `/`;
		}
		return response.data;
	},
	async ( error ) =>
	{
		return error
	}
);

const headers = { 
	"x_authorization": localStorage.getItem( 'access_token' ) 
};


export const postMethod = ( path, data ) =>
{
	return axiosClient.post( `${ process.env.REACT_APP_API }${ path }`, data, {headers: headers} )
		.then( response => response )
		.catch( error =>
		{
			return {
				status: 'error',
				message: 'Error create data'
			}
		} );
}

export const getMethod = async ( path, params ) =>
{
	return await axiosClient.get( `${ process.env.REACT_APP_API }${ path }`, {headers: headers, params: params} )
		.then( response =>
		{
			return response;
		} )
		.catch( error =>
		{
			return {
				status: 'error',
				message: 'Error get data'
			}
		} );

}

export const putMethod = ( path, data ) =>
{
	return axiosClient.put( `${ process.env.REACT_APP_API }${ path }`, data, {headers: headers} )
		.then( response => response )
		.catch( error =>
		{
			return {
				status: 'error',
				message: 'Error update data'
			}
		} );

}

export const deleteMethod = ( path ) =>
{
	return axiosClient.delete( `${ process.env.REACT_APP_API }${ path }`, {headers: headers} )
		.then( response => response )
		.catch( error =>
		{
			return {
				status: 'error',
				message: 'Error delete data'
			}
		} );
}

export const uploadFile = async ( file ) =>
{


	return axios.post( `${ process.env.REACT_APP_API }upload-avatar`, file, { headers: { 'Accept': 'multipart/form-data' } } )
		.then( response => response.data )
		.catch( error =>
		{
			return {
				status: 'error',
				message: 'Error upload file'
			}
		} );
}

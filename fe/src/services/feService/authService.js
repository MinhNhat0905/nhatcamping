import { buildFilter } from "../../common/helper";
import { deleteMethod, getMethod, postMethod, putMethod } from "../baseService";

export const AuthService = {
	async register ( data )
	{
		return await postMethod( 'auth/register', data );
	},

	async login ( data )
	{
		return await postMethod( 'auth/login', data );
	},
	
	async getProfile ()
	{
		return await getMethod( 'profile' );
	},
	async updateProfile ( data )
	{
		return await putMethod( 'profile', data );
	},
	async changePassword ( data )
	{
		return await putMethod( '/change-password', data );
	}
}
import axiosClient from "./axiosClient";

export const AuthService = {



    async login(data) {
        try {
		    return await axiosClient.post(`auth/login`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

	async register(data) {
        try {
		    return await axiosClient.post(`auth/register`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async updateProfile(id, data) {
        try {
		    return await axiosClient.put(`admin/user/update/${id}`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

	async getProfile() {
        try {
		    return await axiosClient.get(`profile`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async updateInfo(data) {
        try {
            console.log('------------- UPDATE');
            return await axiosClient.put(`profile`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
    },

}

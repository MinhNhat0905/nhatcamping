import axiosClient from "./axiosClient";
import { buildFilter } from "../services/common";

const userApi = {

	async getLists(params) {
        try {
            let filters = buildFilter(params);
		    return await axiosClient.get(`admin/user`, {params: filters});
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async findById(id) {
        try {
            return await axiosClient.get(`admin/user/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
    },

    async create(data) {
        try {
		    return await axiosClient.post(`admin/user/store`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async update(id, data) {
        try {
		    return await axiosClient.put(`admin/user/update/${id}`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async delete(id) {
        try {
		    return await axiosClient.delete(`admin/user/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

}

export default userApi;

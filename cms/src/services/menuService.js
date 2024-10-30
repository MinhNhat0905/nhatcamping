import axiosClient from "./axiosClient";
import { buildFilter } from "./common";

const menuApi = {

	async getLists(params) {
        try {
            let filters = buildFilter(params);
		    return await axiosClient.get(`admin/menu`, {params: filters});
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async findById(id) {
        try {
            return await axiosClient.get(`admin/menu/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
    },

    async create(data) {
        try {
		    return await axiosClient.post(`admin/menu/store`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async update(id, data) {
        try {
		    return await axiosClient.put(`admin/menu/update/${id}`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async delete(id) {
        try {
		    return await axiosClient.delete(`admin/menu/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

}

export default menuApi;

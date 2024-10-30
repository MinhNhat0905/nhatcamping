import axiosClient from "./axiosClient";
import { buildFilter } from "../services/common";

const adminApi = {

	async getLists(params) {
        try {
            let filters = buildFilter(params);
		    return await axiosClient.get(`admin/admin`, {params: filters});
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async findById(id) {
        try {
            return await axiosClient.get(`admin/admin/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
    },

    async create(data) {
        try {
		    return await axiosClient.post(`admin/admin/store`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async update(id, data) {
        try {
		    return await axiosClient.put(`admin/admin/update/${id}`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async delete(id) {
        try {
		    return await axiosClient.delete(`admin/admin/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

}

export default adminApi;

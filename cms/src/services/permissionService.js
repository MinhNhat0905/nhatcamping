import axiosClient from "./axiosClient";
import { buildFilter } from "./common";

const permissionApi = {

	async index(params) {
        try {
            let filters = buildFilter(params);
		    return await axiosClient.get(`admin/permission`, {params: filters});
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async findById(id) {
        try {
            return await axiosClient.get(`admin/permission/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
    },
    async create(data) {
        try {
		    return await axiosClient.post(`admin/permission/store`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async update(id, data) {
        try {
		    return await axiosClient.put(`admin/permission/update/${id}`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async delete(id) {
        try {
		    return await axiosClient.delete(`admin/permission/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

}

export default permissionApi;

import axiosClient from "./axiosClient";
import { buildFilter } from "./common";

const roleApi = {

	async index(params) {
        try {
            let filters = buildFilter(params);
		    return await axiosClient.get(`admin/role`, {params: filters});
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async findById(id) {
        try {
            return await axiosClient.get(`admin/role/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
    },
    async create(data) {
        try {
		    return await axiosClient.post(`admin/role/store`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async update(id, data) {
        try {
		    return await axiosClient.put(`admin/role/update/${id}`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async delete(id) {
        try {
		    return await axiosClient.delete(`admin/role/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

}

export default roleApi;

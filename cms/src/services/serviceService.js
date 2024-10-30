import axiosClient from "./axiosClient";
import { buildFilter } from "../services/common";

const serviceApi = {

	async getServices(params) {
        try {
            let filters = buildFilter(params);
		    return await axiosClient.get(`admin/service`, {params: filters});
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async getDServiceById(id) {
        try {
		    return await axiosClient.get(`admin/service/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async createService(data) {
        try {
		    return await axiosClient.post(`admin/service/store`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async findById(id) {
        try {
            return await axiosClient.get(`admin/service/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
    },

    async updateService(id, data) {
        try {
		    return await axiosClient.put(`admin/service/update/${id}`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},
    async delete(id) {
        try {
            return await axiosClient.delete(`admin/service/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
    },

}

export default serviceApi;

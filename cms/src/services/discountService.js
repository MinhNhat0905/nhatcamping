import axiosClient from "./axiosClient";
import { buildFilter } from "../services/common";

const discountApi = {

	async getDiscounts(params) {
        try {
            let filters = buildFilter(params);
		    return await axiosClient.get(`admin/discount`, {params: filters});
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async findById(id) {
        try {
            return await axiosClient.get(`admin/discount/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
    },

	async getDiscountById(id) {
        try {
		    return await axiosClient.get(`admin/discount/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async createDiscount(data) {
        try {
		    return await axiosClient.post(`admin/discount/store`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async updateDiscount(id, data) {
        try {
		    return await axiosClient.put(`admin/discount/update/${id}`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async delete(id) {
        try {
		    return await axiosClient.delete(`admin/discount/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

}

export default discountApi;

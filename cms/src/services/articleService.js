import axiosClient from "./axiosClient";
import { buildFilter } from "./common";

const articleApi = {

	async getArticles(params) {
        try {
            let filters = buildFilter(params);
		    return await axiosClient.get(`admin/article`, {params: filters});
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async findById(id) {
        try {
            return await axiosClient.get(`admin/article/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
    },

    async createArticle(data) {
        try {
		    return await axiosClient.post(`admin/article/store`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async updateArticle(id, data) {
        try {
		    return await axiosClient.put(`admin/article/update/${id}`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async delete(id) {
        try {
		    return await axiosClient.delete(`admin/article/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

}

export default articleApi;

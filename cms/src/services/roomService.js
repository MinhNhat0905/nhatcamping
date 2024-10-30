import axiosClient from "./axiosClient";
import { buildFilter } from "../services/common";

const roomApi = {

	async getRooms(params) {
        try {
            let filters = buildFilter(params);
		    return await axiosClient.get(`admin/room`, {params: filters});
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async createRoom(data) {
        try {
		    return await axiosClient.post(`admin/room/store`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async findById(id) {
        try {
            return await axiosClient.get(`admin/room/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
    },

    async updateRoom(id, data) {
        try {
		    return await axiosClient.put(`admin/room/update/${id}`, data);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

    async delete(id) {
        try {
		    return await axiosClient.delete(`admin/room/${id}`);
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},

}

export default roomApi;

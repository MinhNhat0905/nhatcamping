import axiosClient from "./axiosClient";
import { buildFilter } from "../services/common";

const dashboardApi = {

	async getStatistics(params) {
        try {
            let filters = buildFilter(params);
		    return await axiosClient.get(`admin/monthly-statistics`, {params: filters});
        } catch (error) {
            return {
                status: 'error'
            }
        }
	},
}

export default dashboardApi;

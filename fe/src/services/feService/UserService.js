// services/feService/userService.js
import { getMethod, postMethod, putMethod, deleteMethod } from "../baseService";
import { buildFilter } from "../../common/helper";
export const UserService = {
  // Lấy thông tin người dùng theo userId
  async getUserById(userId) {
    try {
      return await getMethod(`users/${userId}`);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error; // Ném lại lỗi để có thể xử lý tiếp ở nơi gọi
    }
  },

  // Lấy danh sách người dùng với các filter
  async getUsers(filters) {
    const params = buildFilter(filters);  // Giả sử bạn có buildFilter để tạo params từ filters
    return await getMethod('users', params);
  },

  // Tạo người dùng mới
  async createUser(data) {
    return await postMethod('users/store', data);
  },

  // Cập nhật thông tin người dùng
  async updateUser(userId, data) {
    return await putMethod(`users/${userId}`, data);
  },

  // Xóa người dùng
  async deleteUser(userId) {
    return await deleteMethod(`users/${userId}`);
  },
  
};

const { buildParamPaging, buildResponsePaging } = require( "../../helpers/buildData.helper" );
const Facility = require("../../models/Facility.model");

exports.index = async (req, res) => {

    try {
        const condition = {};
		const paging = buildParamPaging( req.query );
		 // Truy vấn danh sách tiện nghi với phân trang
		const facilities = await Facility.find()
			.where( condition )
			.limit( paging.page_size )
			.skip( ( paging.page - 1 ) * paging.page_size )
            .select('name created_at')
			.exec();

		 // Lấy tổng số tài liệu trong bảng Facility
		// const count = await Facility.count().where(condition);
        const count = await Facility.countDocuments(condition);


		// Tạo metadata cho phân trang
		const meta = buildResponsePaging( paging.page, paging.page_size, count )
		const status = 200;
		const data = {
			facilities: facilities
		}
        
        res.json({
            data,
            meta,
            status
        });
    } catch (err) {
        console.error(err.message);
    }
};

exports.show = async (req, res) => {
    try {
        const facility = await Facility.findOne({ _id: req.params.id });
        if (!facility) {
            return res.status(404).json({ error: "Facility not found!" });
        }
        return res.status(200).json({ data: facility, status: 200 });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
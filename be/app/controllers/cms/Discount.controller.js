const Discount = require("./../../models/Discount.model")

exports.index = async (req, res) => {
    const page = req.query.page || 1; const page_size = req.query.page_size  || 10;

    try {
        // execute query with page and limit values
        const discounts = await Discount.find()
            .limit(page_size)
            .skip((page - 1) * page_size)
            .exec();

        // get total documents in the Posts collection
        const count = await Discount.count();

        // return response with posts, total pages, and current page
        const meta = {
            total_page: Math.ceil(count / page_size),
            total: count,
            current_page: parseInt(page),
            page_size: parseInt(page_size)
        }
        const status =  200;
        const data = {
            discounts: discounts
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
        const discounts = await Discount.findOne({ _id: req.params.id })
        return res.status(200).json({ data: discounts, status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "Discount doesn't exist!" })
    }
};

exports.store = async (req, res) => {
    const discount = new Discount({
        name: req.body.name,
        price: req.body.price || 0,
        status: req.body.status || 1
    })
    await discount.save()
    return res.status(200).json({ data: discount, status : 200 });
};

exports.update = async (req, res) => {
    try {
        const discount = await Discount.findOne({ _id: req.params.id })
		if(discount) {
			if (req.body.name) {
				discount.name = req.body.name;
			}
			if (req.body.price) {
				discount.price = req.body.price;
			}
			if (req.body.status) {
				discount.status = req.body.status;
			}
	
			await discount.save();
			return res.status(200).json({ data: discount, status: 200 });
		}
        
    } catch {
        res.status(404)
        res.send({ error: "Discount doesn't exist!" })
    }
};

exports.delete = async (req, res) => {
    try {
        await Discount.deleteOne({ _id: req.params.id })
        return res.status(200).json({ data: [], status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "Discount doesn't exist!" })
    }
};

const Booking = require("./../../models/Booking.model") // new
const moment = require("moment");

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
exports.monthlyStatistics = async (req, res) => {
    // destructure page and limit and set default values
    const page = req.query.page || 1; const page_size = req.query.page_size  || 10;

    try {
        // execute query with page and limit values
        const responseGroupStatus = await Booking.aggregate([
            {
                $group:
                    {
                        _id: { status: "$status" },
                        totalStatus: { $sum: 1 },
                        totalMoney: { $sum: "$total_money" }
                    }
            }
        ]);

        let chartStatus = {};
        if (responseGroupStatus) {
            let arrLabel = [];
            let arrData = [];
            for(let i = 0 ; i < responseGroupStatus.length ; i ++) {
                arrLabel.push(responseGroupStatus[i]._id.status);
                arrData.push(responseGroupStatus[i].totalMoney);
            }

            chartStatus.label = arrLabel;
            chartStatus.data = arrData;
        }

        const responseGroupDay = await Booking.aggregate([
            {
                $group : {
                    _id : { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    totalMoney: { $avg: "$total_money" },
                    count: { $sum: 1 }
                }
            },
        ]);

        const date = moment();
        let year = date.year();
        let month = date.format('MM');
        const totalDay = daysInMonth(month, year);
        let arrListDay = [];
        for( let i = 1 ; i <= totalDay; i ++) {
            if (i < 10) i = '0' + `${i}`;
            arrListDay.push(`${year}-${month}-${i}`);
        }
        console.log('---------- arrListDay: ', arrListDay);

        let arrListDayMapping = [];
        for(let i = 0 ; i < arrListDay.length ; i ++) {
            arrListDayMapping[i] = {
                _id: arrListDay[i],
                totalMoney: 0,
                count: 0
            }

            for(j = 0 ; j < responseGroupDay.length ; j ++) {
                if (responseGroupDay[j]._id === arrListDay[i]) {
                    arrListDayMapping[i] = {
                        _id: arrListDay[i],
                        totalMoney: responseGroupDay[j].totalMoney ,
                        count: responseGroupDay[j].count
                    }
                    break;
                }
            }
        }

        console.log('-------- KET: ', arrListDayMapping);
        let resultTotalPrice = arrListDayMapping.map(a => a.totalMoney);
        const status =  200;
        const data = {
            group_status: chartStatus,
            group_day: arrListDayMapping,
            list_money_by_day: resultTotalPrice,
            list_day: arrListDay
        }
        res.json({
            data,
            status
        });
    } catch (err) {
        console.error(err.message);
    }
};

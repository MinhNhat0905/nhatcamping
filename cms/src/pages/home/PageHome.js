import React, { useEffect, useState } from 'react';
// import { Alert, Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { Alert, Col, Container, Row, Form } from "react-bootstrap";
import dashboardApi from '../../services/dashboardService';
import { 
	Chart as ChartJS, 
	CategoryScale, 
	LinearScale, 
	BarElement, 
	Title, 
	Tooltip, 
	Legend, 
	ArcElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top',
		},
		title: {
			display: true,
			text: 'Biểu đồ thống kê hàng tháng',
		},
	},
};

export default function PageHome () {

	const [params, setParams] = useState({
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),
	});
	const [dataCharStatus, setDataChartStatus] = useState({});
	const [dataChartListDayInMonth, setDataChartListDayInMonth] = useState({});
	const [loadingChartStatus, setLoadingChartStatus] = useState(true);
	const [totalUser, setTotalUser] = useState(0);
	const [totalProduct, setTotalProduct] = useState(0);
	const [totalOrder, setTotalOrder] = useState(0);
	
	const getDashboard = async (filters) => {
		const response = await dashboardApi.getStatistics(filters);
		if (response?.status === 'success' || response?.status === 200) {
			setDataChartStatus({
				labels: response.data.group_status.label,
				datasets: [
					{
						label: '# of Votes',
						data: response.data.group_status.data,
						backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(54, 162, 235, 0.2)',
							'rgba(255, 206, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(153, 102, 255, 0.2)',
							'rgba(255, 159, 64, 0.2)',
						],
						borderColor: [
							'rgba(255, 99, 132, 1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 206, 86, 1)',
							'rgba(75, 192, 192, 1)',
							'rgba(153, 102, 255, 1)',
							'rgba(255, 159, 64, 1)',
						],
						borderWidth: 1,
					},
				],
			});
			setDataChartListDayInMonth({
				labels: response.data.list_day,
				datasets: [
					{
						label: 'Thống kê',
						data: response.data.list_money_by_day,
						backgroundColor: 'rgba(255, 99, 132, 0.5)',
					}
				],
			});
			 // Cập nhật số lượng người dùng, phòng và booking
			 setTotalUser(response.data.totalUser);
			 setTotalProduct(response.data.totalProduct);
			 setTotalOrder(response.data.totalOrder);
			 setLoadingChartStatus(false);
		}
	};

	// Lấy dữ liệu khi params (month, year) thay đổi
	useEffect(() => {
		getDashboard(params);
	}, [params]);

	// Cập nhật tháng khi thay đổi
	const handleMonthChange = (e) => {
		setParams({ ...params, month: e.target.value });
	};

	// Cập nhật năm khi thay đổi
	const handleYearChange = (e) => {
		setParams({ ...params, year: e.target.value });
	};

	return (
		<Container>
			<Row>
				<Col>
					<Alert variant="success">
						<Alert.Heading>ADMIN Dashboard</Alert.Heading>
					</Alert>
				</Col>
			</Row>
			<Row>
				<Col md={6}>
					<Form.Group controlId="selectMonth">
						<Form.Label>Chọn Tháng</Form.Label>
						<Form.Control as="select" value={params.month} onChange={handleMonthChange}>
							{Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
								<option key={month} value={month}>{`Tháng ${month}`}</option>
							))}
						</Form.Control>
					</Form.Group>
				</Col>
				<Col md={6}>
					<Form.Group controlId="selectYear">
						<Form.Label>Chọn Năm</Form.Label>
						<Form.Control as="select" value={params.year} onChange={handleYearChange}>
							{Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
								<option key={year} value={year}>{year}</option>
							))}
						</Form.Control>
					</Form.Group>
				</Col>
			</Row>
			<div className="row">
				<div className="col-sm-4">
					<div className="box p-3 mb-2 bg-primary text-white">
						<h6>Người dùng <b id="totalUser">{totalUser}</b></h6>
					</div>
				</div>
				<div className="col-sm-4">
					<div className="box p-3 mb-2 bg-danger text-white">
						<h6>Số phòng <b id="totalProduct">{totalProduct}</b></h6>
					</div>
				</div>
				<div className="col-sm-4">
					<div className="box p-3 mb-2 bg-info text-white">
						<h6>Đã booking <b id="totalOrder">{totalOrder}</b></h6>
					</div>
				</div>
		</div>
			<Row>
				<Col className="col-8">
					{!loadingChartStatus && (
						<Bar options={options} data={dataChartListDayInMonth} />
					)}
				</Col>
				<Col className="col-4">
					{!loadingChartStatus && (
						<Doughnut data={dataCharStatus} />
					)}
				</Col>
			</Row>
		</Container>
	);
}

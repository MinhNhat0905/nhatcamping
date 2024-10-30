import React, { useEffect, useState } from 'react';
import { Alert, Breadcrumb, Col, Container, Row } from "react-bootstrap";
import dashboardApi from '../../services/dashboardService';
import
	{
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


export default function PageHome ()
{

	const [ params, setParams ] = useState( {} );
	const [ dataCharStatus, setDataChartStatus ] = useState( {} );
	const [ dataChartListDayInMonth, setDataChartListDayInMonth ] = useState( {} );
	const [ loadingChartStatus, setLoadingChartStatus ] = useState( true );


	const getDashboard = async ( filters ) =>
	{
		const response = await dashboardApi.getStatistics( filters )
		if ( response?.status === 'success' || response?.status === 200 )
		{
			setDataChartStatus( {
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
			} )
			setDataChartListDayInMonth( {
				labels: response.data.list_day,
				datasets: [
					{
						label: 'Thống kế',
						data: response.data.list_money_by_day,
						backgroundColor: 'rgba(255, 99, 132, 0.5)',
					}
				],
			} )
			setLoadingChartStatus( false );
		}
	}


	useEffect( () =>
	{
		getDashboard( { ...params } ).then( r => { } );
	}, [] );

	return (
		<Container>
			<Row>
				<Col>
					<Alert variant="success">
						<Alert.Heading>Xin chào</Alert.Heading>
						<p>Chào mừng bạn đến với hệ thống quản lý khách sạn của chúng tôi</p>
					</Alert>
				</Col>
			</Row>
			<div className="row">
				<div className="col-sm-3">
					<div className="box p-3 mb-2 bg-primary text-white">
						<h6>Thành viên <b id="totalUser">6</b></h6>
					</div>
				</div>
				<div className="col-sm-3">
					<div className="box p-3 mb-2 bg-danger text-white">
						<h6>Số phòng <b id="totalProduct">6</b></h6>
					</div>
				</div>
				<div className="col-sm-3">
					<div className="box p-3 mb-2 bg-info text-white">
						<h6>Đã booking <b id="totalOrder">9</b>
						</h6>
					</div>
				</div>
				<div className="col-sm-3">
					<div className="box p-3 mb-2 bg-secondary text-white">
						<h6>User mới <b id="totalUserNew">0</b></h6>
					</div>
				</div>
			</div>
			<Row>
				<Col className={ 'col-8' }>
					{ loadingChartStatus === false && (
						<Bar options={ options } data={ dataChartListDayInMonth } />
					) }
				</Col>
				<Col className={ 'col-4' }>
					{ loadingChartStatus === false && (
						<Doughnut data={ dataCharStatus } />
					) }
				</Col>
			</Row>
		</Container>
	);
}

import React from "react";
import ProfilePage from "../page/auth/profilePage";
import RoomPage from "../page/room/roomPage";
import ServicePage from "../page/room/servicePage";
import BlogsPage from "../page/others/blogPage";
import ContactPage from "../page/others/contactPage";
import Home from "../page/home/home";
import ErrorPage from "../page/auth/error";
import SignUpPage from "../page/auth/registerPage";
import { SignInPage } from "../page/auth/loginPage";
import RoomDetailPage from "../page/room/roomDetailPage";
import { BlogDetail } from "../components/blog/blogDetail";
import { FormBooking } from "../components/form/formBooking";
import { BookingPage } from "../page/others/BookingPage";
import { PaymentStatus } from "../components/booking/paymentStatus";
import { ServiceDetail } from "../components/room-service/serviceDetail";

export const Routers = [
	//profile Section(User Profile)

	{ path: "/room", title: 'Room', component: <RoomPage /> },
	{
		path: "/room/:id",
		parents: [
			{
				title: 'Room',
				path: '/room'
			}
		],
		title: 'Chi tiết phòng',
		component: <RoomDetailPage />
	},
	// menu
	{
		path: "/menu/:id",
		title: 'Menu',
		component: <BlogsPage />
	},

	{
		path: "/menu",
		title: 'Menu',
		component: <BlogsPage />
	},

	{
		path: "/menu/show/:id/",
		title: 'Chi tiết',
		parents: [
			{
				title: 'Menu',
				path: '/menu'
			}
		],
		component: <BlogDetail />
	},
	//booking
	{
		path: "/booking/create",

		title: "Đặt phòng",
		component: <FormBooking />
	},

	{
		path: "/booking/create/:id",

		title: "Đặt phòng",
		component: <FormBooking />
	},

	{
		path: "/booking",
		title: "Lịch sử đặt phòng",
		component: <BookingPage />
	},

	{
		path: "/payment/:type",
		title: "Thanh toán",
		component: <PaymentStatus />
	},

	{
		path: "/service",
		title: 'Dịch vụ',
		component: <ServicePage />
	},

	{
		path: "/service/:id",
		title: 'Chi tiết dịch vụ',
		parents: [
			{
				title: 'Dịch vụ',
				path: '/service'
			}
		],
		component: <ServiceDetail />
	},

	// other
	{
		path: "/home",
		component: <Home />
	},
	{
		path: "/account",
		title: 'Thông tin tài khoản',
		component: <ProfilePage />
	},
	{
		path: "/contact",
		title: 'Liên hệ',
		component: <ContactPage />
	},
	{ path: "/", component: <Home /> },
	{ path: "/error", component: <ErrorPage /> },

];

export const AuthRoutes = [
	{ path: "/sign-up", component: <SignUpPage /> },
	{ path: "/sign-in", component: <SignInPage /> }
]

import PageHome from "../pages/home/PageHome";
import NotFound from "../pages/404/NotFound";
import PageDiscount from "../pages/discount/PageDiscount";
import PageArticle from "../pages/article/PageArticle";
import CreateArticle from "../pages/article/CreateArticle";
import UpdateArticle from "../pages/article/UpdateArticle";
import PageRoom from "../pages/room/PageRoom";
import CreateRoom from "../pages/room/CreateRoom";
import UpdateRoom from "../pages/room/UpdateRoom";
import PageService from "../pages/service/PageService";
import CreateService from "../pages/service/CreateService";
import UpdateService from "../pages/service/UpdateService";
import PageUser from "../pages/user/PageUser";
import CreateUser from "../pages/user/CreateUser";
import UpdateUser from "../pages/user/UpdateUser";
import CreateDiscount from "../pages/discount/CreateDiscount";
import UpdateDiscount from "../pages/discount/UpdateDiscount";
import PageBooking from "../pages/booking/PageBooking";
import UpdateBooking from "../pages/booking/UpdateBooking";
import { LoginPage } from "../pages/auth/Login";
import PagePermission from "../pages/permission/PagePermission";
import CreatePermission from "../pages/permission/CreatePermission";
import UpdatePermission from "../pages/permission/UpdatePermission";
import PageRole from "../pages/role/PageRole";
import UpdateRole from "../pages/role/UpdateRole";
import CreateRole from "../pages/role/CreateRole";
import React from "react";
import PageAdmin from "../pages/admin/PageAdmin";
import CreateAdmin from "../pages/admin/CreateAdmin";
import UpdateAdmin from "../pages/admin/UpdateAdmin";
import PageErrorPermission from "../pages/errors/403";
import AccountUser from "../pages/account/AccountUser";
import PageMenu from "../pages/menu/PageMenu";
import CreateMenu from "../pages/menu/CreateMenu";
import UpdateMenu from "../pages/menu/UpdateMenu";
import PageCategory from "../pages/category/PageCategory";
import CreateCategory from "../pages/category/CreateCategory";
import UpdateCategory from "../pages/category/UpdateCategory";

export const routes = () =>
{
	return [
		{
			path: "/",
			element: <PageHome />,
			index: true,
			exact: true
		},
		{
			path: "/discount/",
			children: [
				{
					path: "",
					element: <PageDiscount />
				},
				{
					path: "create",
					element: <CreateDiscount />
				},
				{
					path: "update/:id",
					element: <UpdateDiscount />
				},
				{
					path: "*",
					element: <PageDiscount />,
				},
			]
		},
		{
			path: "/article/",
			children: [
				{
					path: "",
					element: <PageArticle />,
				},
				{
					path: "create",
					element: <CreateArticle />,
				},
				{
					path: "update/:id",
					element: <UpdateArticle />,
				},
				{
					path: "*",
					element: <PageArticle />,
				},
			]
		},
		{
			path: "/menu/",
			children: [
				{
					path: "",
					element: <PageMenu />,
				},
				{
					path: "create",
					element: <CreateMenu />,
				},
				{
					path: "update/:id",
					element: <UpdateMenu />,
				},
				{
					path: "*",
					element: <PageMenu />,
				},
			]
		},
		{
			path: "/category/",
			children: [
				{
					path: "",
					element: <PageCategory />,
				},
				{
					path: "create",
					element: <CreateCategory />,
				},
				{
					path: "update/:id",
					element: <UpdateCategory />,
				},
				{
					path: "*",
					element: <PageCategory />,
				},
			]
		},
		{
			path: "/booking/",
			children: [
				{
					path: "",
					element: <PageBooking />,
				},
				{
					path: "create",
					element: <CreateArticle />,
				},
				{
					path: "update/:id",
					element: <UpdateBooking />,
				},
				{
					path: "*",
					element: <PageBooking />,
				},
			]
		},
		{
			path: "/service/",
			children: [
				{
					path: "",
					element: <PageService />,
				},
				{
					path: "create",
					element: <CreateService />,
				},
				{
					path: "update/:id",
					element: <UpdateService />,
				},
				{
					path: "*",
					element: <PageService />,
				}
			]
		},
		{
			path: "/user/",
			children: [
				{
					path: "",
					element: <PageUser />,
				},
				{
					path: "create",
					element: <CreateUser />,
				},
				{
					path: "update/:id",
					element: <UpdateUser />,
				},
				{
					path: "*",
					element: <PageUser />,
				}
			]
		},
		{
			path: "/permission/",
			children: [
				{
					path: "",
					element: <PagePermission />,
				},
				{
					path: "create",
					element: <CreatePermission />,
				},
				{
					path: "update/:id",
					element: <UpdatePermission />,
				},
				{
					path: "*",
					element: <PagePermission />,
				}
			]
		},
		{
			path: "/role/",
			children: [
				{
					path: "",
					element: <PageRole />,
				},
				{
					path: "create",
					element: <CreateRole />,
				},
				{
					path: "update/:id",
					element: <UpdateRole />,
				},
				{
					path: "*",
					element: <PageRole />,
				}
			]
		},
		{
			path: "/admin/",
			children: [
				{
					path: "",
					element: <PageAdmin />,
				},
				{
					path: "create",
					element: <CreateAdmin />,
				},
				{
					path: "update/:id",
					element: <UpdateAdmin />,
				},
				{
					path: "*",
					element: <PageAdmin />,
				}
			]
		},
		{
		    path: "/403",
		    element: <PageErrorPermission />,
		},
		{
		    path: "/account",
		    element: <AccountUser />,
		},
		{
			path: "/room/",
			children: [
				{
					path: "",
					element: <PageRoom />,
				},
				{
					path: "create",
					element: <CreateRoom />,
				},
				{
					path: "update/:id",
					element: <UpdateRoom />,
				},
				{
					path: "*",
					element: <PageRoom />,
				}
			]
		},

		{
			path: "/auth",
			children: [
				{
					path: "login",
					element: <LoginPage />,
				},
				// {
				//     path: "register",
				//     element: <RegisterPage />,
				// }
			]
		},
		{
			path: '*',
			element: <NotFound />
		},
	]
}

export const AuthRoutes = [{
	path: "/auth",
	children: [
		{
			path: "login",
			element: <LoginPage />,
		},
		// {
		//     path: "register",
		//     element: <RegisterPage />,
		// }
	]
},]

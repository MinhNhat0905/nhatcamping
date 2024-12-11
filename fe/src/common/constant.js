import imgdefault1 from '../assets/images/campingbanner1.gif';
import imgdefault2 from '../assets/images/campingbanner2.jpg';
import imgdefault3 from '../assets/images/campingbanner3.jpg';
import imgdefault4 from '../assets/images/campingbanner4.jpg';
import img1 from '../assets/images/room-1.jpg';
import blog from '../assets/images/image_7.jpg';
import defaultUser from '../assets/images/default-avatar.png';
import defaultImg from '../assets/images/image_faildoad.png';
import notFoundImg from '../assets/images/not-found-address-mob.jpg';
import errorImg from '../assets/images/cancel.png';
import success from '../assets/images/success.png';

export const STATIC_URL_IMAGE=process.env.REACT_APP_URL_IMAGE;
export const default1 = imgdefault1;
export const default2 = imgdefault2;
export const default3 = imgdefault3;
export const default4 = imgdefault4;
export const defa = imgdefault2;
export const defaultD = blog;

export const DEFAULT_USER = defaultUser;
export const DEFAULT_IMG = defaultImg;
export const NOTFOUND_IMG = notFoundImg;
export const SUCCESS_IMG = success;
export const ERROR_IMG = errorImg;

export const Gender = [
	{
		value: 'NAM',
		label: 'Nam'
	},
	{
		value: 'Nữ',
		label: 'Nữ'
	},
	{
		value: 'Khác',
		label: 'Khác'
	}
];

export const INIT_PAGING = {
	current_page: 1,
	page_size: 9,
	total_page: 1,
	total: 0
};

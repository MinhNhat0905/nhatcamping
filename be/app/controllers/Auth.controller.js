const User = require( "./../models/User.model" ) // new
const bcrypt = require( 'bcryptjs' );

const jwt = require( 'jsonwebtoken' );
const promisify = require( 'util' ).promisify;

const sign = promisify( jwt.sign ).bind( jwt );
const verify = promisify( jwt.verify ).bind( jwt );

const authMiddleware = require( './../../app/middleware/AuthJwt' );
const Article = require( "../models/Article.model" );
const isAuth = authMiddleware.isAuth;

exports.register = async ( req, res ) =>
{
	try
	{
		console.log( '----------- req: ', req.body );
		const email = req.body.email.toLowerCase();
		const checkUser = await User.findOne( { email: email } );
		if ( checkUser ) return res.status( 200 ).json( { data: 'Tài khoản đã tồn tại', status: 403 } );

		const hashPassword = bcrypt.hashSync( req.body.password, 12 );
		console.log( '---------- hasPassword', hashPassword );
		const user = new User( {
			email: email,
			password: hashPassword,
			name: req.body.name,
			age: req.body.age,
			sex: req.body.sex,
			birthday: req.body.birthday,
			phone: req.body.phone
		} );

		console.log( '----------- user: ', user );

		await user.save();

		console.log( '--------- user: ', user );

		return res.status( 200 ).json( { data: user, status: 200 } );
	} catch {
		res.status( 404 )
		res.send( { error: "register doesn't exist!" } )
	}
};

exports.login = async ( req, res ) =>
{
	try
	{
		const email = req.body.email.toLowerCase();
		const user = await User.findOne( { email: email } );
		if ( !user ) return res.status( 200 ).json( { data: 'Tài khoản không tồn tại', status: 403 } );

		const isPasswordValid = bcrypt.compareSync( req.body.password, user.password );
		if ( !isPasswordValid )
		{
			return res.status( 200 ).json( { message: 'Mật khẩu không chính xác', status: 403 } );
		}

		const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
		const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

		const dataForAccessToken = {
			email: user.email,
		};
		const accessToken = await this.generateToken(
			dataForAccessToken,
			accessTokenSecret,
			accessTokenLife,
		);
		if ( !accessToken )
		{
			return res
				.status( 401 )
				.send( {message: 'Đăng nhập không thành công, vui lòng thử lại.'} );
		}
		const response = {
			accessToken: accessToken,
			user: user
		}
		return res.status( 200 ).json( { data: response, status: 200 } );
	} catch {
		res.status( 404 )
		res.send( { error: "register doesn't exist!" } )
	}
};
exports.getProfile = async ( req, res ) =>
{
	try
	{
		const user = req.user;
		const response = {
			user: user
		}
		return res.status( 200 ).json( { data: response, status: 200 } );
	} catch {
		res.status( 404 )
		res.send( { error: "register doesn't exist!" } )
	}
};

exports.updateInfo = async ( req, res ) =>
{
	try
	{
		const user = req.body;
		console.log( '------------------ USer', user );


		const userUpdate = await User.findOne( { _id: req.user._id } )
		console.log( '------------------ USER UPDATE', userUpdate );
		if ( user.name )
		{
			userUpdate.name = user.name;
		}
		if ( user.avatar )
		{
			userUpdate.avatar = user.avatar;
		}

		if ( user.birthday )
		{
			userUpdate.birthday = user.birthday;
		}

		if ( user.phone )
		{
			userUpdate.phone = user.phone;
		}

		await userUpdate.save();

		const response = {
			user: userUpdate
		}
		return res.status( 200 ).json( { data: response, status: 200 } );
	} catch ( e )
	{
		console.log( '------------- e', e );
		res.status( 501 );
		res.send( { error: "updateInfo error!".e } )
	}
};

exports.changePassword = async ( req, res ) =>
{
	try
	{
		const passwordData = req.body;
		const user = req.user;
		console.log( '------------------ password', user );
		if ( !passwordData || !passwordData.old_password || !passwordData?.new_password )
		{
			res.send( { error: "Password not empty!" } );
		}



		const userUpdate = await User.findOne( { _id: req.user._id } )
		console.log( '------------------ USER UPDATE', userUpdate );
		if ( userUpdate )
		{
			const isPasswordValid = bcrypt.compareSync( passwordData.old_password, user.password );
			if ( !isPasswordValid )
			{
				return res.status( 200 ).json( { message: 'Mật khẩu không chính xác', status: 403 } );
			}
			userUpdate.password = bcrypt.hashSync( passwordData.new_password.trim(), 12 );
			await userUpdate.save();
		}
		
		const response = {
			user: userUpdate
		}
		return res.status( 200 ).json( { data: response, status: 200 } );
	} catch ( e )
	{
		res.status( 501 );
		res.send( { error: "updateInfo error!", e } )
	}
};


exports.generateToken = async ( payload, secretSignature, tokenLife ) =>
{
	try
	{
		return await sign(
			{
				payload,
			},
			secretSignature,
			{
				algorithm: 'HS256',
				expiresIn: tokenLife,
			},
		);
	} catch ( error )
	{
		console.log( `Error in generate access token:  + ${ error }` );
		return null;
	}
};


// exports.updateRefreshToken = async (username, refreshToken) => {
//     try {
//         await db
//             .get(TABLENAME)
//             .find({username: username})
//             .assign({refreshToken: refreshToken})
//             .write();
//         return true;
//     } catch {
//         return false;
//     }
// };

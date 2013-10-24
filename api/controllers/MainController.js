/**
 * MainController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {


  index: function (req, res) {
	if(req.session.usr){
		res.view();
	}else
		res.view('main/login');
  },

  login: function (req, res) {
	req.session.usr = null;
	var uname = req.param('username');
	var pword = req.param('password');
	User.findOne({username : uname, password : pword}).done(function(e, u) {
		if (e) {
			res.json({
				success: false,
				error:'Koneksi gagal',
			});
			return console.log('Koneksi gagal');
		} else if(u) {
			req.session.usr = uname;
			res.json({
				success: true,
				message:'Login berhasil.',
			});
			return console.log(uname+" berhasil .");
		} else {
			res.json({
				success: false,
				error:'Username atau Password tidak tepat.',
			});
			return console.log(uname+" gagal login. Username atau Password tidak tepat.");
		}
	});
  },

  register: function (req, res) {
	var uname = req.param('username');
	var pword = req.param('password');
	var cword = req.param('confirmpassword');
	User.findOne({username : uname}).done(function(e, u) {
		if (e) {
			res.json({
				success: false,
				error:'Koneksi gagal',
			});
			return console.log('Koneksi gagal');
		} else if(u) {
			res.json({
				success: false,
				error:'Username '+uname+' sudah ada. Silahkan daftarkan username lain.',
			});
			return console.log(uname+" gagal registrasi. Username sudah digunakan.");
		} else {
			if(pword!=cword){
				res.json({
					success: false,
					error:'Password dan Konfirmasi Password tidak sama.',
				});
				return console.log(uname+" gagal registrasi. Password dan Konfirmasi Password tidak sama.");
			} else {
				User.create({
					id: null,
					username: uname,
					password: pword
				}).done(function(err, user) {
					if (err) {
						if(err.ValidationError){
							res.json({
								success: false,
								error: 'Username atau password harus 4-30 karakter.'
							});
							return console.log(uname+" gagal registrasi. Validasi fiels gagal.");
						}
						res.json({
							success: false,
							error: 'Koneksi gagal'
						});
						return console.log('Koneksi gagal');
					} else {
						res.json({
							success: true,
							message:'Registrasi berhasil. Silahkan login',
						});
						return console.log('Registrasi berhasil : '+uname);
					}
				});
			}
		  }
	});
  },

  chat: function (req, res) {
	if(req.session.usr){
		var tchat = req.param('chat_text');
		var uname = req.session.usr;
		Chat.create({
			id: null,
			username: uname,
			chat_text: tchat
		}).done(function(err, user) {
			if (err) {
				res.broadcast('msg', {
					success: false,
					error:'Koneksi gagal',
					code: 404
				});
				return console.log(uname+' : '+tchat);
			}else{
				Chat.subscribe( req.socket );
				Chat.publishCreate({
					success: true,
					message: tchat,
					username: uname
				})
				res.json({
					success: true,
					message: tchat,
					username: uname
				});
				console.log(uname+' : '+tchat);			
			}
		});
	}else{
		res.json({
			success: false,
			error : 'autentifikasi gagal',
			code : 400
		});
		return console.log('autentifikasi chat gagal');
	}
  },

  chatinit: function (req, res) {
	if(req.session.usr){
		var today = new Date();
		var ss = today.getMilliseconds()
		var nn = today.getMinutes();
		var hh = today.getHours();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();

		if(dd<10){dd='0'+dd} 
		if(mm<10){mm='0'+mm} 
		if(hh<10){hh='0'+hh} 
		if(nn<10){nn='0'+nn} 
		if(ss<10){ss='00'+ss} if(ss<100){ss='0'+ss} 

		today = yyyy+'-'+mm+'-'+dd+' '+hh+':'+nn+':'+ss;
		
		Chat.find({
			where: {
				createdAt: {
					'<': today
				}
			},
			limit: 10,
			sort: 'createdAt ASC'
		}, function(err, cl) {
			res.json({
				success: true,
				data : cl
			});			
		});
	}else{
		res.json({
			success: false,
			error : 'autentifikasi gagal',
			code : 400
		});
		return console.log('autentifikasi chat gagal');
	}
  }   

};

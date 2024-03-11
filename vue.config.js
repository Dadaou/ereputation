module.exports= {
	devServer:{
		proxy:{
			'/api':{
				target:"https://api.nexties.fr",
				changeOrigin:true,
				pathRewrite:{
					'^/api':''
				}
			}
		}
	}
}

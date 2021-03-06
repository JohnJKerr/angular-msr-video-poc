﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.FileProviders;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Routing;
using Microsoft.AspNet.StaticFiles;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Runtime;

namespace Backend
{
	public class Startup
	{
		private string _filePath;

		public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
		{
			_filePath = appEnv.ApplicationBasePath + "\\uploads\\";
		}

		// This method gets called by a runtime.
		// Use this method to add services to the container
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddMvc();
			services.AddCors();
			services.ConfigureCors(options => options.AddPolicy("AllowAll", 
				p => p.AllowAnyOrigin()
					.AllowAnyMethod()
					.AllowAnyHeader()));
			// Uncomment the following line to add Web API services which makes it easier to port Web API 2 controllers.
			// You will also need to add the Microsoft.AspNet.Mvc.WebApiCompatShim package to the 'dependencies' section of project.json.
			// services.AddWebApiConventions();
		}

		// Configure is called after ConfigureServices is called.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			// Configure the HTTP request pipeline.
			app.UseStaticFiles();
			app.UseFileServer(new FileServerOptions()
			{
				FileProvider = new PhysicalFileProvider(_filePath),
				RequestPath = new PathString("/uploads"),
				EnableDirectoryBrowsing = true
			});

			// Add MVC to the request pipeline.
			app.UseMvc();
			// Add the following route for porting Web API 2 controllers.
			// routes.MapWebApiRoute("DefaultApi", "api/{controller}/{id?}");
		}
	}
}

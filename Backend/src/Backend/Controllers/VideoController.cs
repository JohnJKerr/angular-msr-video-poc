using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Cors.Core;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Framework.Runtime;

namespace Backend.Controllers
{
	[Route("video")]
	[DisableCors]
	public class VideoController : Controller
	{
		private string _filePath;

		public VideoController(IApplicationEnvironment appEnv)
		{
			_filePath = appEnv.ApplicationBasePath + "\\uploads\\";
		}

		// POST api/values
		[HttpPost]
		public void Post(string filename, IFormFile video)
		{
			video.SaveAs(Path.Combine(_filePath, filename));
		}

		private static string GetFileName(IFormFile file) => file.ContentDisposition.Split(';')
																.Select(x => x.Trim())
																.Where(x => x.StartsWith("filename="))
																.Select(x => x.Substring(9).Trim('"'))
																.First();
	}
}

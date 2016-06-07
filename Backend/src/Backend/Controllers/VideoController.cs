using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNet.Cors.Core;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Framework.Runtime;

namespace Backend.Controllers
{
	[Route("video")]
	[EnableCors("AllowAll")]
	public class VideoController : Controller
	{
		private string _filePath;
		private string _binaryPath;

		public VideoController(IApplicationEnvironment appEnv)
		{
			_filePath = appEnv.ApplicationBasePath + "\\uploads\\";
			_binaryPath = appEnv.ApplicationBasePath + "\\Binaries\\";
		}

		// POST api/values
		[HttpPost]
		public void Post(string filename, IFormFile video)
		{
			video.SaveAs(Path.Combine(_filePath, filename));
		}

		[HttpPost]
		[Route("endvideo/{id}")]
		public void End(string id)
		{
			var files = new DirectoryInfo(_filePath).GetFiles(id + "*.webm");
			var validWebmFiles = files
				.Where(WebmFileIsValid)
				.ToList();

			var mergedWebm = MergeWebmFiles(validWebmFiles);
		}

		private bool WebmFileIsValid(FileInfo file)
		{
			// Create a process that runs the file through MkvInfo.
			// MkvInfo is a utility that gives info on Matroska based video files.
			// https://mkvtoolnix.download/doc/mkvinfo.html
			var process = new Process()
			{
				StartInfo = new ProcessStartInfo()
				{
					FileName = _binaryPath + "mkvinfo.exe",
					Arguments = file.DirectoryName + "\\" + file.Name,
					UseShellExecute = false,
					CreateNoWindow = true,
					RedirectStandardOutput = true
				}
			};

			process.Start();
			process.WaitForExit();

			// If the exit code is not 0, then the file is not a valid video file.
			return process.ExitCode == 0;
		}

		private FileInfo MergeWebmFiles(List<FileInfo> files)
		{
			var fileNames = files.Select(f => f.DirectoryName + "\\" + f.Name).ToArray();
			var fileArgs = string.Join(" + ", fileNames);
            var newFileName = $"{files.First().DirectoryName}\\{Guid.NewGuid()}.webm";
            String args = $"-o {newFileName} -w {fileArgs}";

			// Create a process that merges the video files using MkvMerge.
			// MkvMerge is a utility that is used to merge Matroska based video files.
			// https://mkvtoolnix.download/doc/mkvmerge.html
			var process = new Process()
			{
				StartInfo = new ProcessStartInfo()
				{
					FileName = _binaryPath + "mkvmerge.exe",
					Arguments = args,
					UseShellExecute = false,
					CreateNoWindow = true,
					RedirectStandardError = true
				}
			};

			process.Start();
			process.WaitForExit();
			if(process.ExitCode != 0)
				throw new ArgumentException("Error merging videos");
			return new FileInfo(newFileName);
		}
	}
}

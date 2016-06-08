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
		public object End(string id)
		{
			var files = new DirectoryInfo(_filePath).GetFiles(id + "*.webm");
			var validWebmFiles = files
				.Where(WebmFileIsValid)
				.ToList();
			validWebmFiles.ForEach(EnsureWebmTracksAreConsistent);
			var mergedWebm = MergeWebmFiles(validWebmFiles);
			files.ToList().ForEach(f => f.Delete());

			return new {Video = mergedWebm.Name};
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
					Arguments = file.FullName,
					UseShellExecute = false,
					CreateNoWindow = true,
					RedirectStandardOutput = true
				}
			};

			process.Start();
			process.WaitForExit(5000);
			int exitCode = process.ExitCode;

			// If the exit code is not 0, then the file is not a valid video file.
			return exitCode == 0;
		}

		private void EnsureWebmTracksAreConsistent(FileInfo file)
		{
			var trackInfo = GetTrackDataForWebmFile(file);
			if(trackInfo[0].ToLower().Contains("video")) return;

			string correctedVideoFilename = $"{file.DirectoryName}\\{Guid.NewGuid()}.webm";
			string args = $"-i {file.FullName} -map 0:1 -map 0:0 -c copy {correctedVideoFilename}";

			var process = new Process()
			{
				StartInfo = new ProcessStartInfo()
				{
					FileName = _binaryPath + "ffmpeg.exe",
					Arguments = args,
					UseShellExecute = false,
					CreateNoWindow = true,
					RedirectStandardError = true
				}
			};

			process.Start();
			process.WaitForExit();

			if(process.ExitCode != 0)
				throw new ArgumentException($"Error correcting track order on video: {file.FullName}");

			var correctedVideo = new FileInfo(correctedVideoFilename);
			var originalFilename = file.FullName;
			file.Delete();
			correctedVideo.CopyTo(originalFilename);
			correctedVideo.Delete();
		}

		private Dictionary<int, string> GetTrackDataForWebmFile(FileInfo file)
		{
			// Use MkvMerge --identify to get the track data for the given file.
			// https://mkvtoolnix.download/doc/mkvmerge.html
			var process = new Process()
			{
				StartInfo = new ProcessStartInfo()
				{
					FileName = _binaryPath + "mkvmerge.exe",
					Arguments = $"--identify {file.DirectoryName}\\{file.Name}",
					UseShellExecute = false,
					CreateNoWindow = true,
					RedirectStandardOutput = true
				}
			};

			string output = String.Empty;
			process.Start();
			while (!process.StandardOutput.EndOfStream)
			{
				output += process.StandardOutput.ReadLine();
			}

			// parse output for track values
			var values = output.Split(new string[] { "Track ID ", "File ", "container: " }, StringSplitOptions.RemoveEmptyEntries);
			var tracks = values
				.Where(t => char.IsDigit(t[0]) && t[1] == ':')
				.Select(t => t.Split(':'))
				.ToDictionary(pair => Convert.ToInt32(pair[0]), pair => pair[1]);

			return tracks;
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

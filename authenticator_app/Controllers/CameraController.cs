using System;
using System.Collections.Generic;
using System.IO;
using DemoWebCam.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using IBM.Cloud.SDK.Core.Authentication.Iam;
using IBM.Cloud.SDK.Core.Http;
using IBM.Watson.VisualRecognition.v3;
using IBM.Watson.VisualRecognition.v3.Model;

namespace nsVisualRecognitionAuthenticationApp.Controllers
{
    /// <summary>
    /// CameraController takes care of invoking IBM Watson Visual Recognition Service to Authenticate the students
    /// </summary>
    public class CameraController : Controller
    {
        private readonly IHostingEnvironment _environment;
        public CameraController(IHostingEnvironment hostingEnvironment)
        {
            _environment = hostingEnvironment;
        }

        [HttpGet]
        public IActionResult Capture()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Results()
        {
            return View();
        }

        /// <summary>
        /// HttpPost Action which POST the captured images of the students to IBM Watson Visual Recognition Service and returns 
        /// the JSONResults/JSON based response which authenticate a valid student
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Capture(string name)
        {
            DetailedResponse<ClassifiedImages> result;
            try
            {

                var files = HttpContext.Request.Form.Files;

                if (files != null)
                {
                    foreach (var file in files)
                    {
                        if (file.Length > 0)
                        {
                            // Getting Filename
                            var fileName = file.FileName;
                            // Unique filename "Guid"
                            var myUniqueFileName = Convert.ToString(Guid.NewGuid());
                            // Getting Extension
                            var fileExtension = Path.GetExtension(fileName);
                            // Concating filename + fileExtension (unique filename)
                            var newFileName = string.Concat(myUniqueFileName, fileExtension);
                            //  Generating Path to store photo 
                            var filepath = Path.Combine(_environment.WebRootPath, "CameraPhotos") + $@"\{newFileName}";

                            if (!string.IsNullOrEmpty(filepath))
                            {
                                // Storing Image in Folder
                                StoreInFolder(file, filepath);
                                //Invoke IBM Watson Visual Recognition Service to Validate the Image is a valid student
                                IamAuthenticator authenticator = new IamAuthenticator(
    apikey: "vGmgjjlH6pmHMKIbakm_CI7yeAQzFRvuxbZNUPH3BOf5"
    );
                                VisualRecognitionService visualRecognition = new VisualRecognitionService("2018-03-19", authenticator);
                                visualRecognition.SetServiceUrl("https://api.us-south.visual-recognition.watson.cloud.ibm.com/instances/d8433848-a95d-42ab-b6e8-c756f9c49349");
                                visualRecognition.WithHeader("X-Watson-Learning-Opt-Out", "true");
                                visualRecognition.DisableSslVerification(true);
                                using (FileStream fs = System.IO.File.OpenRead(filepath))
                                {
                                    using (MemoryStream ms = new MemoryStream())
                                    {
                                        fs.CopyTo(ms);
                                        result = visualRecognition.Classify(
                                            imagesFile: ms,
                                            imagesFilename: newFileName,
                                            threshold: 0.6f,
                                            classifierIds: new List<string>() { "DefaultCustomModel_1728885394" }
                                            );
                                    }
                                }
                                ViewBag.VisualRecognitionResult = result.Response;
                                VisualRecognitionModel vrmodel = new VisualRecognitionModel();
                                vrmodel.identifiedname = result.Response;
                                return Json(result.Response);
                            }
                        }
                    }
                    return Json(true);
                }
                else
                {
                    return Json(false);
                }
            }
            catch (Exception ex)
            {
                return Json(ex);
            }

        }

        /// <summary>
        /// Saving captured image into the Application Root Folder.
        /// </summary>
        /// <param name="file"></param>
        /// <param name="fileName"></param>
        private void StoreInFolder(IFormFile file, string fileName)
        {
            using (FileStream fs = System.IO.File.Create(fileName))
            {
                file.CopyTo(fs);
                fs.Flush();
            }
        }

    }
}
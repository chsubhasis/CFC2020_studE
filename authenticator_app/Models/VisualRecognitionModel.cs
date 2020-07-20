using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemoWebCam.Models
{
    public class VisualRecognitionModel
    {
        public string images { get; set; }
        public string classifiers { get; set; }
        public string classifier_id { get; set; }
        public string modelname { get; set; }
        public string classes { get; set; }
        public string identifiedname { get; set; }
        public string score { get; set; }
        public string image { get; set; }
        public string images_processed { get; set; }
        public string custom_classes { get; set; }

    }
}

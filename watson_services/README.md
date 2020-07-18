# CFC2020_stud-E
# IBM Watson Services

# Pre-requisites of using these services

1) Create IBM Watson services (Natural Language Understaning, Language Translator, Discovery, Visual Recognition). Note down the API KEY, Service URL and versions.
2) Install IBM Cloud CLI in your system.


# How to use these Services?

1) Rename the python file as __main__.py 
2) Bundle each service along with ibm_watson and ibm_cloud_sdk_core packages, in separate folders.
3) Zip the folder and upload in IBM Cloud as FaaS (function as a service) action. Use IBM Cloud CLI and used the sample command below, for each service.
 ibmcloud fn action create visual_recognition visual.zip --kind python:3.7
4) Once the Action is created, login to the IBM Cloud portal and test the action with sample input.
5) Create API Gateway to access the services and expose REST APIs for consumption.
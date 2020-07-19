# CFC2020_stud-E
# IBM Watson Services

# Pre-requisites of using these services

1) Create IBM Watson services (Natural Language Understaning, Language Translator, Discovery, Visual Recognition). Note down the API KEY, Service URL and versions.
2) Install IBM Cloud CLI in your system.
3) Install Python SDK for IBM Watson.


# How to use these Services?

1) Rename the python file as __main__.py 
2) Bundle each service along with ibm_watson and ibm_cloud_sdk_core packages, in separate folders.
3) Zip the folder and upload in IBM Cloud as FaaS (function as a service) action. Use IBM Cloud CLI and used the sample command below, for each service.
 <br><b>ibmcloud fn action create visual_recognition visual.zip --kind python:3.7</b>
4) Once the Action is created, login to the IBM Cloud portal and test the action with sample input.
5) Create API Gateway to access the services and expose REST APIs for consumption.

# How to test individual REST APIs?

<b>Translator Service</b><br>
REST API: https://0f675bd4.eu-gb.apigw.appdomain.cloud/translator/translate <br>
Sample Input for English to Bengali conversion:
{
  "mydata": "Test me",
   "modelid": "en-bn"
}<br>
Corresponding Output:
{"msg":"আমাকে পরীক্ষা করো\"}<br>

<b>Discovery Service</b><br>
REST API: https://0f675bd4.eu-gb.apigw.appdomain.cloud/discovery_pdf/search <br>
Sample Input:
{
  "mydata": "What is Newton?",
}<br>
Corresponding Output (truncated here):
{"msg":""\"Newton (unit) The newton (symbol: N ) is the International System of Units(..."}<br>

<b> Natural Language Understanding Service</b><br>
REST API: https://0f675bd4.eu-gb.apigw.appdomain.cloud/suggestionbox/postme <br>
Sample Input:
{
  "mydata": "Our school is great!",
}<br>
Corresponding Output:
This service doesnt return core JSON object. So, you may face issues while viewing the output as JSON. Application parse the object properly for retriving the sentiments.

<b> Notification Service </b><br>
REST API: https://0f675bd4.eu-gb.apigw.appdomain.cloud/notification/sendsms<br>
Sample Input:
{
  "mydata": "This is a Test SMS",
}<br>
Corresponding Output:
{
    "msgsid": "SMS Sent"
}
<br>Twilio trial account accepts only 1 number; hence this is hard coded. In reality, we will treat destination number and text, both as dynamic.

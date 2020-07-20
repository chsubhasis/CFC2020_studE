# Step 1: Before you begin
You'll need the following:-

1. Create Free/Lite version of the IBM Cloud account & Visual Recognition Service and create a Custom Classifier Model for Mood Analysis
2. Train the custom visual recognition model for each individual mood images (>=10 images for each of the 7 moods - angry, disgusted, fearful, happy, neutral, sad, surprised)
2. IBM Cloud CLI:- Install it from https://cloud.ibm.com/docs/cli?topic=cli-getting-started
3. Git:- Install it from https://git-scm.com/downloads
4. Install .NET Core SDK 3.1 from the .NET Core downloads website at https://dotnet.microsoft.com/download

# Step 2: Run the app locally
1. On the command line, change the directory to where the sample app is located.
	cd get-started-aspnet-core/src/GetStartedDotnet

2. Run the app locally by running the following commands.
	dotnet restore
	dotnet run

3. View your app at: http://localhost:5000/.

# Step 3:Prepare the app for deployment
1. Open the manifest.yml file, and change the name from GetStartedDotnet to your app name, app_name.

# Step 4: Deploy the app by using the following IBM Cloud CLI commands from the command prompt-
1. IBMCloud login
2. IBMCloud target --cf
3. IBMCloud cf push ethicalhackersvisualrecognitionapp
4. Once the app is pushed to IBM CloudFoundry you can view the app at https://ethicalhackersvisualrecognitionapp.eu-gb.cf.appdomain.cloud/

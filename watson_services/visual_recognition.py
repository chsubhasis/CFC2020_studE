#visual recognition service used for student authentication and mood analysis
import json
from ibm_watson import VisualRecognitionV3
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson import ApiException

def main(args):
        authenticator = IAMAuthenticator('tmbr2hVDD4UjHHyVkpP99wcLoZz1jU2NoHc7vGH7mAFd')
        visual_recognition = VisualRecognitionV3(
                version='2018-03-19',
                authenticator=authenticator
            )
        visual_recognition.set_service_url('https://api.us-south.visual-recognition.watson.cloud.ibm.com/instances/c46b05ae-21d1-4ba1-bea0-ede174674834')
        classifier_ids = ["Mood_Model_101620031"]
        #share the location of the image file
        url = args["mydata"]
        try:
                classes = visual_recognition.classify(url=url, classifier_ids=classifier_ids)
                myresult = classes.get_result()['images'][0]['classifiers'][0]['classes'][0]['class']
                return {"msg": json.dumps(myresult, indent=2)}
        except ApiException as ex:
                print("Method failed with status code " + str(ex.code) + ": " + ex.message)
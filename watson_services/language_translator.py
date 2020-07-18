# Language Translator Service used for Multi-lingual Closed Captioning
import json
from ibm_watson import LanguageTranslatorV3
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson import ApiException

def main(args):
    authenticator = IAMAuthenticator('PWzyR1kIdLALfwz7g8t6y6K4loj2J17IBVk5DzCNXeiT')
    language_translator = LanguageTranslatorV3(
        version='2018-05-01',
        authenticator=authenticator
    )

    language_translator.set_service_url('https://api.eu-gb.language-translator.watson.cloud.ibm.com/instances/eeba748f-07b6-4a7c-8480-f3ab502bd90a')

    try:
        # Invoke a Language Translator method
        translation = language_translator.translate(
            text=args["mydata"],
            model_id=args["modelid"]).get_result()
        return {"msg": json.dumps(translation, indent=2, ensure_ascii=False)}
    except ApiException as ex:
        return {"msg": "Method failed with status code " + str(ex.code) + ": " + ex.message}
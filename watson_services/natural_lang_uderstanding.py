# Natural language understanding service used for analysis suggestions and complains
# And, accordingly analyse the sentiments
import json
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_watson.natural_language_understanding_v1 import Features, KeywordsOptions, CategoriesOptions, \
    EmotionOptions, SentimentOptions

def main(args):
    # Authentication via IAM
    authenticator = IAMAuthenticator('ewfuHONkTNZwuU4iEi9V1dMc_5zj5jFIVPV2bnIIVS9a')
    service = NaturalLanguageUnderstandingV1(
        version='2018-05-01',
        authenticator=authenticator)
    service.set_service_url(
        'https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/473c30e7-ae76-4297-9ce2-dd439323e43e')
    response = service.analyze(
        text=args["mydata"],
        features=Features(
            categories=CategoriesOptions(limit=1),
            emotion=EmotionOptions(document=True),
            keywords=KeywordsOptions(limit=2, sentiment=False, emotion=True),
            sentiment=SentimentOptions()
        ),
        return_analyzed_text=True
    ).get_result()
    return{"msg": json.dumps(response, indent=2)}

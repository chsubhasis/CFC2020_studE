# Discovery service to retrieve data from text book
import json
from ibm_watson import DiscoveryV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson import ApiException

def main(args):
    authenticator = IAMAuthenticator('fEimjQ_OMKVR0RmWgu3cr4W-Q6jo4VaJ-m2oLwYwTLzR')
    discovery_pdf = DiscoveryV1(
        version='2019-04-30',
        authenticator=authenticator
    )

    discovery_pdf.set_service_url('https://api.eu-gb.discovery.watson.cloud.ibm.com/instances/66c464a5-af86-427e-92dd-35a40b092969')
    myqry = args["mydata"]
    try:
        mydata = discovery_pdf.query('bbda9998-e223-4758-af3c-99e3fe520676', '451e8d81-8ddb-4e44-9214-d910a8fe0a82', filter=None, query=None, natural_language_query=myqry, passages=None, aggregation=None, count=1, return_='text', offset=None, sort=None, highlight=None, passages_fields=None, passages_count=None, passages_characters=None, deduplicate=None, deduplicate_field=None, similar=None, similar_document_ids=None, similar_fields=None, bias=None, spelling_suggestions=None, x_watson_logging_opt_out=None)
        myresult = mydata.get_result()['results'][0]['text']
        print(json.dumps(myresult, indent=2))
        return {"msg": json.dumps(myresult, indent=2)}
    except ApiException as ex:
        print("Method failed with status code " + str(ex.code) + ": " + ex.message)
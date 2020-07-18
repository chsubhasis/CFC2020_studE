# pip install twilio
# This service uses Twilio to send SMS
# Twilio trial account accepts only 1 number; hence this is hard coded
# In reality, we will treat destination number and text, both as dynamic

from twilio.rest import Client

def main(args):
    account_sid = 'AC10ce03212b4cda310ae5e32cbb710240'
    auth_token = 'e21e5de1384adc3e62a9dbdebd8bdeed'
    client = Client(account_sid, auth_token)
    message = client.messages \
                    .create(
                        body=args["mydata"],
                        from_='+12513697007',
                        to='+919903288470'
                     )
    return {"msgsid": "SMS Sent"}
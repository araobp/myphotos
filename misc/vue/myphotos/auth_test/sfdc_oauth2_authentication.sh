curl -vvv -X POST https://login.salesforce.com/services/oauth2/token \
  -d "grant_type=authorization_code" \
  -d "code=$1" \
  -d "client_id=$SFDC_CONSUMER_KEY" \
  -d "client_secret=$SFDC_CONSUMER_SECRET" \
  -d "redirect_uri=$SFDC_REDIRECT_URI"

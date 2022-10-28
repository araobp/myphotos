import axios from "axios"
import querystring from "querystring"

const args = process.argv.slice(2);
const authorizationCode = args[0];

const consumerKey = process.env.SFDC_CONSUMER_KEY;
const consumerSecret = process.env.SFDC_CONSUMER_SECRET;
const redirectUri = process.env.SFDC_REDIRECT_URI;

const data = {
  grant_type: "authorization_code",
  code: authorizationCode,
  client_id: consumerKey,
  client_secret: consumerSecret,
  redirect_uri: redirectUri
}

axios.post('https://login.salesforce.com/services/oauth2/token', querystring.stringify(data))
  .then(res => console.log(`access_token: ${res.data.access_token}`))
  .catch(err => console.error(err))

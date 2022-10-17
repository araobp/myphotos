@RestResource(urlMapping='/nominatim/*')
global class NominatimCallout {

    @HttpGet
    global static String getOperation() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String[] position = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1).split(',');
        Decimal latitude = decimal.valueOf(position[0]);
        Decimal longitude = decimal.valueOf(position[1]);
        return geolocationToAddress(latitude, longitude);
    }

    @AuraEnabled(cacheable=true)
    global static String geolocationToAddress(Decimal latitude, Decimal longitude) {

		String url = 'https://nominatim.openstreetmap.org/reverse?lat=' + latitude + '&lon=' + longitude +'&format=json';
        
        Http h = new Http();
   		HttpRequest req = new HttpRequest();
    	req.setEndpoint(url);
        req.setHeader('Accept', 'application/json');
        req.setHeader('Accept-Language', 'ja');
    	req.setMethod('GET');

	    HttpResponse res = h.send(req);
    	return res.getBody();
    }
}
public class NominatimCallout {

    @AuraEnabled(cacheable=true)
    public static String geolocationToAddress(Decimal latitude, Decimal longitude) {

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
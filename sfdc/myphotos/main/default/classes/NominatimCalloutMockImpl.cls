@isTest
global class NominatimCalloutMockImpl implements HttpCalloutMock {
    
    global static String body = 
    '{"place_id":338276041,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"node","osm_id":9905353611,"lat":"35.542883","lon":"139.6421414","display_name":"ハローサイクリング, 綱島街道, 日吉七丁目, 箕輪町二丁目, 港北区, 横浜市, 神奈川県, 231-0017, 日本","address":{"amenity":"ハローサイクリング","road":"綱島街道","neighbourhood":"箕輪町二丁目","suburb":"港北区","city":"横浜市","province":"神奈川県","ISO3166-2-lvl4":"JP-14","postcode":"231-0017","country":"日本","country_code":"jp"},"boundingbox":["35.542833","35.542933","139.6420914","139.6421914"]}';
    
    global static Decimal latitude = 35.54236976;
    global static Decimal longitude = 139.64190659;

    global HTTPResponse respond(HTTPRequest req) {
        HttpResponse res = new HttpResponse();
        res.setBody(body);
        res.setHeader('Content-Type', 'application/json');
        res.setStatus('OK');
        res.setStatusCode(200);
        return res;
    }
}
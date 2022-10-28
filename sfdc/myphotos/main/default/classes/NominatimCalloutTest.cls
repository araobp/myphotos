@isTest
public class NominatimCalloutTest {

    @isTest
    static void geolocationToAddressTest(){

        Test.setMock(HttpCalloutMock.class, new NominatimCalloutMockImpl());
        String body = NominatimCallout.geolocationToAddress(
            NominatimCalloutMockImpl.latitude,
            NominatimCalloutMockImpl.longitude
            );
        System.debug(body);
        System.assertEquals(NominatimCalloutMockImpl.body, body);
    }

}
@isTest
private class FileUploaderTest {

    @isTest
    private static void FileUploaderTest() {
        String base64 = 'SGVsbG8gV29ybGQh';
        String filename = 'HelloWorld';
        
        Id id = FileUploader.uploadFile(base64, filename, recordId)

    }
}

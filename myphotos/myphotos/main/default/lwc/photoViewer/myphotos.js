//import { Base64 } from '@salesforce/resourceUrl/js-base64.js';

const INTERNAL_ERROR = 'Internal error';

export const getImage = async (baseURL, username, password, uuid) => {
  try {
//    const authHeaders = { Authorization: `Basic ${Base64.encode(`${username}:${password}`)}` };
    const authHeaders = { Authorization: `Basic ${btoa(`${username}:${password}`)}` };
    const acceptOctetStream = { 'Accept': 'application/octet-stream' };
    const headers = { ...acceptOctetStream, ...authHeaders };

    const res = await fetch(`${baseURL}/photo/${uuid}/image`, { method: "GET", headers: headers });
    if (res.status === 200) {
      const data = await res.blob();
      const objectURL = URL.createObjectURL(data);
      return objectURL;
    } else {
      throw new Error('GET image failed');
    }
  } catch (e) {
    throw new Error(INTERNAL_ERROR);
  }
}
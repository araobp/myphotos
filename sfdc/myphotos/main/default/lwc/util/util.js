// [Reference] https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
export const uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export const nominatimResultToAddress = jsonData => JSON.parse(jsonData).display_name.replace(/ /g, '').split(',').reverse().slice(2).join(' ');
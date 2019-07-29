function jsonToGraphqlQuery(jsonObject) {
  if (typeof jsonObject !== 'object' || Array.isArray(jsonObject)) {
    // not an object, stringify using native function
    return JSON.stringify(jsonObject);
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  const props = Object.keys(jsonObject)
    .map((key) => `${key}:${jsonToGraphqlQuery(jsonObject[key])}`)
    .join(',');
  return `{${props}}`;
}

module.exports = jsonToGraphqlQuery;

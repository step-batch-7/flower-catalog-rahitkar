const parseParams = (query, keyValue) => {
  const [key, value] = keyValue.split('=');
  query[key] = decodeURIComponent(value.replace(/\+/g, ' '));
  return query;
};

const readParams = keyValuePairs => {
  return keyValuePairs.split('&').reduce(parseParams, {});
};

module.exports = readParams;

const collectHeadersAndBody = (result, line) => {
  if (line === "") {
    result.body = "";
    return result;
  }

  if ("body" in result) {
    result.body += line;
    return result;
  }
  const [key, value] = line.split(":");
  result.headers[key] = value;
  return result;
};

const parseParams = (query, keyValue) => {
  const [key, value] = keyValue.split("=");
  query[key] = decodeURIComponent(value.replace(/\+/g, ' '));
  return query;
};

const readParams = keyValuePairs => {
  return keyValuePairs.split("&").reduce(parseParams, {});
};

class Request {
  constructor(method, url, headers, body) {
    this.method = method;
    this.url = url;
    this.headers = headers;
    this.body = body;
  }
  static parse(text) {
    const [reqLine, ...headersAndBody] = text.split("\r\n");
    const [method, url] = reqLine.split(" ");
    let { headers, body } = headersAndBody.reduce(collectHeadersAndBody, {
      headers: {}
    });

    if (headers["Content-Type"] === ' application/x-www-form-urlencoded') {
      body = readParams(body);
    }

    const req = new Request(method, url, headers, body);
    return req;
  }
}

module.exports = Request;

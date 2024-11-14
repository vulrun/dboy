const DEBUGGING = process.env?.DEBUGGING === "true";
DEBUGGING && console.log("🚀 ~ DEBUGGING:", DEBUGGING);

const package = require("../package.json");
const { formatStr, countObjectKeys, jsonSerialize, jsonDeserialize } = require("./helper");
const jstub = require("jstub/functions");
const axios = require("jstub/utils/axios");

module.exports = Dboy;

function Dboy(uuid, apiKey, options) {
  if (!uuid) throw new Error("DBOY_BUCKET_UUID_IS_MISSING");
  if (!apiKey) throw new Error("DBOY_APIKEY_IS_MISSING");

  if (!countObjectKeys(options)) options = {};
  if (!options?.baseUrl) options.baseUrl = `https://dboy.apii.in/v1`;

  this.request = {};

  const fetchDboy = (obj) => {
    obj.url = jstub.trimStr(options?.baseUrl, "/") + obj?.url;
    obj.url = formatStr(obj?.url, obj?.urlParams);

    this.request.url = obj?.url;
    this.request.data = obj?.data;
    this.request.method = obj?.method || "GET";
    this.request.headers = {};
    this.request.headers["user-agent"] = `${package.name}/${package.version}`;

    if (String(apiKey).startsWith("aT")) this.request.headers["authorization"] = apiKey;
    if (String(apiKey).startsWith("eyDb")) this.request.headers["x-api-key"] = apiKey;

    DEBUGGING && console.log("🚀 ~ this.request:", JSON.stringify(this.request));
    return axios.request(this.request);
  };

  this.aggregate = (pipeline) => {
    if (!Array.isArray(pipeline) || !pipeline.length) throw new Error("AGGREGATE_PIPELINE_MUST_BE_NON_EMPTY_ARRAY");

    return fetchDboy({
      method: "POST",
      url: `/buckets/{uuid}/aggregate`,
      urlParams: { uuid },
      data: { pipeline: JSON.parse(jsonSerialize(pipeline)) },
    });
  };

  this.findOne = (key) => {
    if (!key) throw new Error("ITEM_KEY_IS_MISSING");

    return fetchDboy({
      url: `/buckets/{uuid}/items/{key}`,
      urlParams: { uuid, key },
    });
  };

  this.find = () => {
    return fetchDboy({
      url: `/buckets/{uuid}/items`,
      urlParams: { uuid },
    });
  };

  this.insert = (items) => {
    return fetchDboy({
      method: "POST",
      url: `/buckets/{uuid}/items`,
      urlParams: { uuid },
      data: { items },
    });
  };

  this.update = (key, update) => {
    if (!key) throw new Error("ITEM_KEY_IS_MISSING");
    if (!update) throw new Error("UPDATE_IS_EMPTY");

    return fetchDboy({
      method: "PATCH",
      url: `/buckets/{uuid}/items/{key}`,
      urlParams: { uuid, key },
      data: update,
    });
  };

  this.delete = (key) => {
    if (!key) throw new Error("ITEM_KEY_IS_MISSING");

    return fetchDboy({
      method: "DELETE",
      url: `/buckets/{uuid}/items/{key}`,
      urlParams: { uuid, key },
    });
  };

  return this;
}

module.exports = {
  formatStr,
  countObjectKeys,
  jsonSerialize,
  jsonDeserialize,
};

function formatStr(str, ...args) {
  if (!str) throw new Error("1st argument must be a string");

  args = args.flat(Infinity);
  if (args.length < 1) return str;

  // If only one argument and it's an object, treat it as named placeholders
  if (args.length === 1 && countObjectKeys(args[0])) {
    const placeholders = args[0];
    return String(str).replace(/{(\w+)}/g, function (match, key) {
      return typeof placeholders[key] !== "undefined" ? placeholders[key] : match;
    });
  }

  // For positional placeholders like {0}, {1}, etc.
  return String(str).replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] !== "undefined" ? args[number] : match;
  });
}

function countObjectKeys(val) {
  if (!val) return 0;
  if (String(val) !== "[object Object]") return 0;
  return Object.keys(val).length;
}

// Helper function to mark types recursively before serialization
function _markTypes(obj) {
  if (obj === null || obj === undefined) return obj;

  // Handle primitive wrappers and specific types
  if (obj instanceof Date) return { __type: "Date", value: obj.toISOString() };
  if (obj instanceof RegExp) return { __type: "RegExp", value: obj.toString() };
  if (typeof obj === "bigint") return { __type: "BigInt", value: obj.toString() };
  if (Array.isArray(obj)) return obj.map(_markTypes);

  // Recursively apply marking to nested objects
  if (String(obj) === "[object Object]") {
    const markedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        markedObj[key] = _markTypes(obj[key]);
      }
    }
    return markedObj;
  }

  return obj;
}

// Function to serialize the object with type marking
function jsonSerialize(obj) {
  return JSON.stringify(_markTypes(obj));
}

function jsonDeserialize(jsonString) {
  return JSON.parse(jsonString, (key, value) => {
    if (value && value.__type === "Date") return new Date(value.value);
    if (value && value.__type === "BigInt") return BigInt(value.value);
    if (value && value.__type === "RegExp") {
      const match = value.value.match(/\/(.*)\/([gimsuy]*)/); // Extract pattern and flags
      return new RegExp(match[1], match[2]);
    }

    return value;
  });
}

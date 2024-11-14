require("dotenv").config();
const Dboy = require("./lib/dboy");
const dboy = new Dboy("fc9f6b29-75e6-426b-b97d-5649f9e8d3e9", "eyDbj2mA1fAryGetxm4B7kD83kHb2VcMdMqONHXr412OTg40Nta8yePYH7P6UwbL", {
  baseUrl: `http://localhost:4080/v1`,
});

(async () => {
  const data = await dboy.aggregate([
    //
    { $match: { _key: "abc" } },
    {
      name: new String("Alice"),
      age: new Number(25),
      birthDate: new Date("1998-05-23"),
      pattern: /test/i,
      largeNumber: BigInt("123456789012345678901234567890"),
      skills: new Array("JavaScript", "Node.js"),
      isActive: new Boolean(true),
      children: null,
    },
  ]);

  console.log("🚀 ~ data:", data);
})();

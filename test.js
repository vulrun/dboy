require("dotenv").config();
const Dboy = require("./index");
const dboy = new Dboy("15891aca-39fb-409b-99ca-1aa1e6c399a5", "15891aca-39fb-409b-99ca-1aa1e6c399a5");

(async () => {
  const data = await dboy.aggregate([
    //
    { $match: { _key: "abc" } },
  ]);

  console.log("🚀 ~ data:", data);
})();

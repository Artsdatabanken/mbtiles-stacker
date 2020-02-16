const tilestacker = require("./src/tilestacker");

const v1 = async (config, frag, res) => {
  if (frag[0] === "layers") return config;
  if (frag.length === 4) {
    const node = await tilestacker.get(config, ...frag);
    if (!node) return "No node!!";
    if (!node.contentType) return "no content-type";
    res.setHeader("Content-Type", node.contentType);
    return node.buffer;
  }
  return frag;
};

module.exports = v1;

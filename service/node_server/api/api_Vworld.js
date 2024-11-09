const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/:z/:y/:x", async (req, res) => {
  const { z, y, x } = req.params;
  try {
    const response = await axios.get(
      `https://api.vworld.kr/req/wmts/1.0.0/${process.env.VWORLD_KEY}/Base/${z}/${y}/${x}.png`,
      {
        responseType: "arraybuffer",
      }
    );
    res.set("Content-Type", "image/png");
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: "이미지를 가져오는 데 실패했습니다." });
  }
});

module.exports = router;

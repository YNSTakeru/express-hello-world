const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3001;

app.post("/", async (req, res) => {
  const originUrl = req.headers.origin;

  if (originUrl !== "https://nippo-kun.vercel.app") {
    res.json({ message: "Hello World!" });
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `${req.body.value} 上記文章は日報です。これについて${req.body.order}の観点からレビューしてください。また太字のマークダウンの代わりに見出しや箇条書きを使って書いてください。改善点があれば具体的に記述してください`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  res.json({ generatedText: text });
});

app.post("/all-review", async (req, res) => {
  const originUrl = req.headers.origin;

  if (originUrl !== "https://nippo-kun.vercel.app") {
    res.json({ message: "Hello World!" });
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `${req.body.value} 上記文章は日報です。誤字脱字があれば校閲してください。日報の内容についてモチベーションが上がるように誉めてください。また太字のマークダウンの代わりに見出しや箇条書きを使って書いてください。改善点があれば具体的に記述してください`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  res.json({ generatedText: text });
});

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

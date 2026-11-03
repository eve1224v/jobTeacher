// server.ts
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
dotenv.config();
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var isProduction = process.env.NODE_ENV === "production";
var PORT = 3e3;
var app = express();
app.use((req, _res, next) => {
  if (typeof req.body === "string") {
    try {
      req.body = JSON.parse(req.body);
      req._body = true;
    } catch {
    }
  } else if (req.body !== void 0 && typeof req.body === "object") {
    req._body = true;
  }
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  next();
});
app.use((req, _res, next) => {
  if (req.url.startsWith("/gemini")) {
    req.url = "/api" + req.url;
  }
  next();
});
function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
}
function getAiClient() {
  const key = getGeminiApiKey();
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
app.get("/api/gemini/status", (_req, res) => {
  const key = getGeminiApiKey();
  res.json({
    hasApiKey: !!key,
    keyName: process.env.GEMINI_API_KEY ? "GEMINI_API_KEY" : process.env.VITE_GEMINI_API_KEY ? "VITE_GEMINI_API_KEY" : process.env.API_KEY ? "API_KEY" : null,
    model: "gemini-3.8-flash",
    status: "ready",
    environment: process.env.VERCEL ? "vercel-serverless" : "node-server"
  });
});
function cleanJsonText(raw) {
  let cleaned = (raw || "").trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  }
  return cleaned;
}
var DEFAULT_TIMEOUT_MS = process.env.VERCEL ? 8e3 : 12e3;
async function callGemini(prompt, systemInstruction, isJson = false, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const ai = getAiClient();
  if (!ai) {
    throw new Error("GEMINI_API_KEY_NOT_CONFIGURED");
  }
  const timeoutPromise = new Promise(
    (_, reject) => setTimeout(() => reject(new Error("GEMINI_TIMEOUT")), timeoutMs)
  );
  const callPromise = ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      ...systemInstruction ? { systemInstruction } : {},
      ...isJson ? { responseMimeType: "application/json" } : {},
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.LOW
      }
    }
  }).then((res) => {
    const text = res.text || res.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
    if (!text.trim()) {
      throw new Error("GEMINI_EMPTY_RESPONSE");
    }
    return text;
  });
  return Promise.race([callPromise, timeoutPromise]);
}
function extractJobHeuristics(rawText, companyHint, roleHint) {
  let company = companyHint || "\uD604\uB300\uC790\uB3D9\uCC28";
  if (/현대오토에버/i.test(rawText)) company = "\uD604\uB300\uC624\uD1A0\uC5D0\uBC84";
  else if (/현대모비스/i.test(rawText)) company = "\uD604\uB300\uBAA8\uBE44\uC2A4";
  else if (/현대위아/i.test(rawText)) company = "\uD604\uB300\uC704\uC544";
  else if (/현대트랜시스/i.test(rawText)) company = "\uD604\uB300\uD2B8\uB79C\uC2DC\uC2A4";
  else if (/HL만도|만도/i.test(rawText)) company = "HL\uB9CC\uB3C4";
  else if (/서연이화/i.test(rawText)) company = "\uC11C\uC5F0\uC774\uD654";
  else if (/기아|KIA/i.test(rawText)) company = "\uAE30\uC544";
  else if (/현대차|현대자동차/i.test(rawText)) company = "\uD604\uB300\uC790\uB3D9\uCC28";
  let role = roleHint || "\uC2A4\uB9C8\uD2B8\uC81C\uC870/\uC81C\uC870DX \uC5D4\uC9C0\uB2C8\uC5B4";
  if (/품질|QC|QA/i.test(rawText)) role = "\uC2A4\uB9C8\uD2B8 \uD488\uC9C8\uAD00\uB9AC \uC5D4\uC9C0\uB2C8\uC5B4";
  else if (/생산기술|생기/i.test(rawText)) role = "\uC0DD\uC0B0\uAE30\uC220 \uC5D4\uC9C0\uB2C8\uC5B4";
  else if (/데이터|AI|머신러닝/i.test(rawText)) role = "\uC81C\uC870 \uB370\uC774\uD130/AI \uC5D4\uC9C0\uB2C8\uC5B4";
  else if (/설비|보전/i.test(rawText)) role = "\uC2A4\uB9C8\uD2B8 \uC124\uBE44\uBCF4\uC804 \uC5D4\uC9C0\uB2C8\uC5B4";
  else if (/MES|SW|소프트웨어/i.test(rawText)) role = "\uC2A4\uB9C8\uD2B8\uD329\uD1A0\uB9AC MES \uAC1C\uBC1C\uC790";
  return { company, role };
}
function buildFallbackJobAnalysis(company, role, rawText = "") {
  const lowerText = rawText.toLowerCase();
  const knownTech = ["Python", "SQL", "C++", "Java", "PLC", "OPC-UA", "MQTT", "Docker", "Kubernetes", "Kafka", "Computer Vision", "OpenCV", "MES", "SCADA"];
  const matchedTech = knownTech.filter((t) => lowerText.includes(t.toLowerCase()));
  const coreTechnologies = matchedTech.length > 0 ? matchedTech : ["Python", "SQL", "OPC-UA", "OpenCV", "Docker", "MES"];
  return {
    companyName: company,
    jobTitle: role,
    department: "\uC0DD\uC0B0\uAE30\uC220\uBCF8\uBD80 \uC81C\uC870\uC194\uB8E8\uC158\uBD80",
    mainDuties: [
      "\uC2A4\uB9C8\uD2B8\uD329\uD1A0\uB9AC \uC124\uBE44(PLC, \uC13C\uC11C) \uC778\uD130\uD398\uC774\uC2A4 \uBC0F MES \uC5F0\uACC4 \uC2DC\uC2A4\uD15C \uAD6C\uCD95",
      "AI \uBE44\uC804 \uAE30\uBC18 \uC778\uB77C\uC778 \uC6A9\uC811/\uB3C4\uC7A5 \uD488\uC9C8 \uAC80\uC0AC \uC54C\uACE0\uB9AC\uC998 \uD604\uC7A5 \uC801\uC6A9 \uBC0F \uAC80\uC99D",
      "\uACF5\uC815 \uC0AC\uC774\uD074\uD0C0\uC784(C/T) \uB2E8\uCD95 \uBC0F \uC124\uBE44 \uAC00\uB3D9 \uD6A8\uC728(OEE) \uBD84\uC11D \uD30C\uC774\uD504\uB77C\uC778 \uAC1C\uBC1C",
      "\uB514\uC9C0\uD138 \uD2B8\uC708 \uAE30\uBC18 \uAC00\uC0C1 \uC2DC\uC6B4\uC804(Virtual Commissioning) \uC2DC\uC2A4\uD15C \uC6B4\uC601"
    ],
    requiredQualifications: [
      "\uCEF4\uD4E8\uD130\uACF5\uD559, \uAE30\uACC4\uACF5\uD559, \uC804\uC790\uACF5\uD559 \uB610\uB294 \uC720\uAD00 \uC774\uACF5\uACC4 \uD559\uC0AC \uC774\uC0C1",
      "Python, C++, Java \uC911 1\uAC1C \uC774\uC0C1 \uD504\uB85C\uADF8\uB798\uBC0D \uAC00\uB2A5\uC790",
      "SQL \uB370\uC774\uD130\uBCA0\uC774\uC2A4 \uBC0F \uAE30\uCD08 \uB370\uC774\uD130 \uBD84\uC11D \uC5ED\uB7C9",
      "\uC0B0\uC5C5\uC6A9 \uD1B5\uC2E0(OPC-UA, MQTT) \uB610\uB294 PLC \uAE30\uBCF8 \uC774\uD574\uC790"
    ],
    preferredQualifications: [
      "\uC2A4\uB9C8\uD2B8\uD329\uD1A0\uB9AC, \uBA38\uC2E0\uBE44\uC804 \uAD00\uB828 \uD504\uB85C\uC81D\uD2B8 \uB610\uB294 \uC778\uD134\uC2ED \uACBD\uD5D8\uC790",
      "\uD074\uB77C\uC6B0\uB4DC \uD658\uACBD(AWS, GCP, Azure) \uB610\uB294 \uCEE8\uD14C\uC774\uB108(Docker, K8s) \uD65C\uC6A9 \uACBD\uD5D8",
      "\uC790\uB3D9\uCC28 \uC81C\uC870\uACF5\uC815(\uD504\uB808\uC2A4, \uCC28\uCCB4, \uB3C4\uC7A5, \uC758\uC7A5) \uB3C4\uBA54\uC778 \uC774\uD574 \uBCF4\uC720\uC790"
    ],
    coreTechnologies,
    competencyKeywords: ["\uC81C\uC870 \uB370\uC774\uD130 \uBD84\uC11D", "\uC774\uC0C1 \uAC10\uC9C0", "\uC0B0\uC5C5\uC6A9 \uD1B5\uC2E0", "\uACF5\uC815 \uCD5C\uC801\uD654", "\uD604\uC7A5 \uB3C4\uBA54\uC778 \uC774\uD574"],
    summary: `${company} ${role} \uBD84\uC57C \uCC44\uC6A9\uACF5\uACE0 \uC6D0\uBB38\uC744 \uAE30\uBC18\uC73C\uB85C \uAD6C\uC870\uD654 \uBD84\uC11D\uB41C \uC9C1\uBB34 \uC694\uC57D\uC785\uB2C8\uB2E4.`,
    isFallback: true
  };
}
app.post("/api/gemini/analyze-job", async (req, res) => {
  try {
    const rawText = req.body?.rawText;
    const companyHint = req.body?.companyHint;
    const roleHint = req.body?.roleHint;
    if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
      return res.status(400).json({ error: "\uCC44\uC6A9\uACF5\uACE0 \uC6D0\uBB38 \uD14D\uC2A4\uD2B8\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694." });
    }
    if (!getGeminiApiKey()) {
      const { company, role } = extractJobHeuristics(rawText, companyHint, roleHint);
      return res.json(buildFallbackJobAnalysis(company, role, rawText));
    }
    const systemInstruction = `\uB2F9\uC2E0\uC740 \uC790\uB3D9\uCC28 \uC81C\uC870 \uC0B0\uC5C5(\uD604\uB300\uC790\uB3D9\uCC28, \uAE30\uC544, \uD604\uB300\uBAA8\uBE44\uC2A4, \uD604\uB300\uC624\uD1A0\uC5D0\uBC84 \uB4F1) \uC804\uBB38 AI \uCC44\uC6A9 \uCEE8\uC124\uD134\uD2B8\uC785\uB2C8\uB2E4.
\uC0AC\uC6A9\uC790\uAC00 \uC81C\uACF5\uD55C \uCC44\uC6A9\uACF5\uACE0 \uC6D0\uBB38\uC744 \uC815\uBC00 \uBD84\uC11D\uD558\uC5EC \uB2E4\uC74C JSON \uD615\uC2DD\uC73C\uB85C\uB9CC \uC751\uB2F5\uD558\uC138\uC694. \uD5C8\uAD6C\uC758 \uC815\uBCF4\uB098 \uB0A0\uC870 \uC5C6\uC774 \uC785\uB825\uB41C \uACF5\uACE0 \uB0B4\uC6A9\uC744 \uAE30\uBC18\uC73C\uB85C \uAD6C\uC870\uD654\uD558\uC138\uC694.
\uD615\uC2DD:
{
  "companyName": "\uAE30\uC5C5\uBA85",
  "jobTitle": "\uC9C1\uBB34\uBA85",
  "department": "\uBD80\uC11C\uBA85(\uCD94\uC815 \uBD88\uAC00\uC2DC \uBE48 \uBB38\uC790\uC5F4)",
  "mainDuties": ["\uD575\uC2EC \uC5C5\uBB34 1", "\uD575\uC2EC \uC5C5\uBB34 2"],
  "requiredQualifications": ["\uD544\uC218 \uC9C0\uC6D0 \uC790\uACA9 1", "2"],
  "preferredQualifications": ["\uC6B0\uB300 \uC0AC\uD56D 1", "2"],
  "coreTechnologies": ["\uD575\uC2EC \uAE30\uC220 \uC2A4\uD0DD"],
  "competencyKeywords": ["\uC694\uAD6C \uD575\uC2EC \uC5ED\uB7C9 \uD0A4\uC6CC\uB4DC"],
  "summary": "1~2\uBB38\uC7A5\uC758 \uACF5\uACE0 \uD575\uC2EC \uC694\uC57D"
}`;
    const prompt = `[\uCC44\uC6A9\uACF5\uACE0 \uC6D0\uBB38]
${rawText}

[\uCD94\uAC00 \uD78C\uD2B8: \uAE30\uC5C5\uBA85=${companyHint || "\uC5C6\uC74C"}, \uD76C\uB9DD\uC9C1\uBB34=${roleHint || "\uC5C6\uC74C"}]`;
    const resultText = await callGemini(prompt, systemInstruction, true);
    const cleaned = cleanJsonText(resultText);
    const parsed = JSON.parse(cleaned);
    return res.json(parsed);
  } catch (error) {
    console.warn("Job analyze fallback triggered:", error?.message || error);
    const text = typeof req.body?.rawText === "string" ? req.body.rawText : "";
    const { company, role } = extractJobHeuristics(text, req.body?.companyHint, req.body?.roleHint);
    return res.json(buildFallbackJobAnalysis(company, role, text));
  }
});
app.post("/api/gemini/generate-questions", async (req, res) => {
  try {
    const { company, jobTitle, major, techStack, difficulty, count = 5 } = req.body;
    if (!getGeminiApiKey()) {
      const fallbackQuestions = [
        {
          id: "q-fb-1",
          question: `\uC790\uB3D9\uCC28 \uC0DD\uC0B0\uB77C\uC778\uC758 \uC2E4\uC2DC\uAC04 \uC124\uBE44 \uBAA8\uB2C8\uD130\uB9C1 \uC2DC\uC2A4\uD15C\uC744 \uAD6C\uCD95\uD560 \uB54C, \uC218\uB9CE\uC740 \uC13C\uC11C \uBC0F PLC \uB370\uC774\uD130 \uC218\uC9D1 \uC2DC \uBC1C\uC0DD\uD558\uB294 \uB124\uD2B8\uC6CC\uD06C \uBCD1\uBAA9\uACFC \uB370\uC774\uD130 \uC190\uC2E4\uC744 \uBC29\uC9C0\uD558\uAE30 \uC704\uD55C \uC544\uD0A4\uD14D\uCC98(\uC608: MQTT, Kafka, \uC5D0\uC9C0 \uCEF4\uD4E8\uD305)\uB97C \uC124\uBA85\uD574\uC8FC\uC138\uC694.`,
          type: "\uC81C\uC870 \uD604\uC7A5 \uC0C1\uD669\uD615",
          category: "\uC81C\uC870DX \uBC0F \uD1B5\uC2E0",
          difficulty: difficulty || "\uC911\uAE09",
          hint: "\uC5D0\uC9C0 \uB2E8\uC5D0\uC11C\uC758 \uB370\uC774\uD130 \uC804\uCC98\uB9AC \uBC0F \uACBD\uB7C9 \uD504\uB85C\uD1A0\uCF5C(MQTT/OPC-UA)\uACFC \uBC84\uD37C\uB9C1\uC744 \uC704\uD55C \uBD84\uC0B0 \uD050(Kafka)\uC758 \uC5ED\uD560\uC744 \uC5B8\uAE09\uD574\uBCF4\uC138\uC694.",
          modelAnswer: `\uD604\uC7A5 \uC124\uBE44(PLC, \uB85C\uBD07) \uACC4\uCE35\uACFC \uC0C1\uC704 MES/\uD074\uB77C\uC6B0\uB4DC \uC0AC\uC774\uC5D0 \uC5D0\uC9C0 \uAC8C\uC774\uD2B8\uC6E8\uC774\uB97C \uBC30\uCE58\uD558\uC5EC \uACE0\uC8FC\uAE30 \uC13C\uC11C \uB370\uC774\uD130\uB97C 1\uCC28 \uD544\uD130\uB9C1 \uBC0F \uB2E4\uC6B4\uC0D8\uD50C\uB9C1\uD569\uB2C8\uB2E4. \uC774\uD6C4 MQTT \uAC19\uC740 \uACBD\uB7C9 Pub/Sub \uD504\uB85C\uD1A0\uCF5C\uB85C \uC5D0\uC9C0\uC5D0\uC11C \uBE0C\uB85C\uCEE4\uB85C \uC804\uC1A1\uD558\uACE0, \uB370\uC774\uD130 \uD30C\uC774\uD504\uB77C\uC778 \uBC31\uC5D4\uB4DC\uC5D0\uB294 Apache Kafka\uB97C \uB3C4\uC785\uD558\uC5EC \uAC11\uC791\uC2A4\uB7EC\uC6B4 \uD2B8\uB798\uD53D \uD3ED\uC8FC \uC2DC\uC5D0\uB3C4 \uCEE8\uC288\uBA38\uAC00 \uC548\uC815\uC801\uC73C\uB85C \uB370\uC774\uD130\uB97C \uC18C\uBE44\uD560 \uC218 \uC788\uB294 \uB514\uCEE4\uD50C\uB9C1 \uBC84\uD37C \uAD6C\uC870\uB97C \uAC16\uCDA5\uB2C8\uB2E4.`,
          keyEvaluationPoints: ["\uC5D0\uC9C0 \uCEF4\uD4E8\uD305 \uC5ED\uD560", "MQTT/Kafka \uB4F1 \uBE44\uB3D9\uAE30 \uBC84\uD37C\uB9C1", "\uB124\uD2B8\uC6CC\uD06C \uB300\uC5ED\uD3ED \uCD5C\uC801\uD654"]
        },
        {
          id: "q-fb-2",
          question: `\uCC28\uCCB4 \uC870\uB9BD \uACF5\uC815\uC5D0\uC11C \uC2A4\uD31F \uC6A9\uC811 \uD488\uC9C8 \uAC80\uC0AC\uB97C \uB525\uB7EC\uB2DD \uAE30\uBC18 \uBE44\uC804 \uBAA8\uB378\uB85C \uC218\uD589\uD560 \uB54C, \uACB0\uD568 \uB370\uC774\uD130(\uBD88\uB7C9 \uB77C\uBCA8)\uC758 \uADF9\uC2EC\uD55C \uB370\uC774\uD130 \uBD88\uADE0\uD615(Class Imbalance) \uBB38\uC81C\uB97C \uC5B4\uB5BB\uAC8C \uD574\uACB0\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`,
          type: "\uAC1C\uB150 \uBC0F \uC54C\uACE0\uB9AC\uC998\uD615",
          category: "AI \uBE44\uC804 \uBC0F \uD488\uC9C8",
          difficulty: difficulty || "\uC911\uAE09",
          hint: "Focal Loss, \uB370\uC774\uD130 \uC99D\uAC15(Augmentation), \uB610\uB294 \uBE44\uC9C0\uB3C4 \uC774\uC0C1\uD0D0\uC9C0(Autoencoder, PatchCore) \uC811\uADFC\uBC95\uC744 \uC0DD\uAC01\uD574\uBCF4\uC138\uC694.",
          modelAnswer: `\uC591\uD488 \uB370\uC774\uD130\uC5D0 \uBE44\uD574 \uBD88\uB7C9 \uB370\uC774\uD130\uAC00 \uADF9\uD788 \uC801\uC740 \uC81C\uC870 \uD604\uC7A5 \uD2B9\uC131\uC0C1, \uC77C\uBC18\uC801\uC778 \uC9C0\uB3C4\uD559\uC2B5 \uBD84\uB958\uAE30 \uB300\uC2E0 \uC591\uD488 \uC774\uBBF8\uC9C0\uC758 \uC815\uC0C1 \uD328\uD134\uB9CC\uC744 \uD559\uC2B5\uD558\uB294 \uBE44\uC9C0\uB3C4 \uC774\uC0C1 \uAC10\uC9C0 \uBAA8\uB378(PatchCore, VAE \uB4F1)\uC744 \uC801\uC6A9\uD558\uC5EC \uC815\uC0C1 \uBD84\uD3EC\uB97C \uBC97\uC5B4\uB09C \uC601\uC5ED\uC744 \uC774\uC0C1\uCE58\uB85C \uD0D0\uC9C0\uD569\uB2C8\uB2E4. \uC9C0\uB3C4\uD559\uC2B5\uC744 \uC801\uC6A9\uD574\uC57C \uD55C\uB2E4\uBA74 Focal Loss \uC801\uC6A9, \uBD88\uB7C9 \uC0D8\uD50C\uC758 \uBB3C\uB9AC \uAE30\uBC18 \uD569\uC131(Defect Augmentation), CutMix \uB4F1\uC758 \uB370\uC774\uD130 \uC99D\uAC15\uC744 \uD65C\uC6A9\uD569\uB2C8\uB2E4.`,
          keyEvaluationPoints: ["\uC81C\uC870 \uB370\uC774\uD130 \uBD88\uADE0\uD615 \uC774\uD574", "\uBE44\uC9C0\uB3C4 \uC774\uC0C1 \uAC10\uC9C0 \uD65C\uC6A9", "Focal Loss \uB610\uB294 \uC99D\uAC15 \uAE30\uBC95"]
        },
        {
          id: "q-fb-3",
          question: `\uC2A4\uB9C8\uD2B8\uD329\uD1A0\uB9AC MES(\uC81C\uC870\uC2E4\uD589\uC2DC\uC2A4\uD15C)\uC640 ERP \uAC04\uC758 \uC5F0\uB3D9\uC5D0\uC11C \uD2B8\uB79C\uC7AD\uC158 \uC815\uD569\uC131(ACID) \uBC0F \uC591\uBC29\uD5A5 \uC778\uD130\uD398\uC774\uC2A4 \uC7A5\uC560 \uC2DC \uC0DD\uC0B0 \uB77C\uC778\uC774 \uBA48\uCD94\uC9C0 \uC54A\uB3C4\uB85D \uC124\uACC4\uD558\uB294 \uBC29\uC548\uC744 \uC124\uBA85\uD574\uC8FC\uC138\uC694.`,
          type: "\uBE44\uAD50 \uBC0F \uC544\uD0A4\uD14D\uCC98\uD615",
          category: "\uC18C\uD504\uD2B8\uC6E8\uC5B4 \uBC0F \uBC31\uC5D4\uB4DC",
          difficulty: difficulty || "\uC2EC\uD654",
          hint: "\uB85C\uCEEC \uC11C\uD0B7 \uBE0C\uB808\uC774\uCEE4, \uC624\uD504\uB77C\uC778 \uC6B0\uC120(Local Caching) \uBC0F \uBE44\uB3D9\uAE30 \uC0AC\uAC00 \uD328\uD134(Saga Pattern)\uC744 \uACE0\uB824\uD574\uBCF4\uC138\uC694.",
          modelAnswer: `\uC0C1\uC704 ERP \uC7A5\uC560 \uC2DC\uC5D0\uB3C4 \uD558\uC704 \uACF5\uC7A5 \uB77C\uC778\uC774 \uC911\uB2E8\uB418\uC9C0 \uC54A\uB3C4\uB85D MES\uB294 \uB3C5\uB9BD\uB41C \uB85C\uCEEC \uB370\uC774\uD130 \uC800\uC7A5\uC18C\uB97C \uBCF4\uC720\uD558\uB294 \uC624\uD504\uB77C\uC778 \uC601\uC18D\uC131(Local Resilience)\uC744 \uAC00\uC838\uC57C \uD569\uB2C8\uB2E4. ERP\uC640\uC758 \uB370\uC774\uD130 \uB3D9\uAE30\uD654\uB294 \uB3D9\uAE30\uC2DD RPC \uB300\uC2E0 \uBA54\uC2DC\uC9C0 \uD050 \uAE30\uBC18\uC758 \uC774\uBCA4\uD2B8 \uB4DC\uB9AC\uBE10 \uC544\uD0A4\uD14D\uCC98\uC640 \uC0AC\uAC00 \uD328\uD134(\uBCF4\uC0C1 \uD2B8\uB79C\uC7AD\uC158)\uC744 \uC801\uC6A9\uD558\uC5EC \uCD5C\uC885 \uC77C\uAD00\uC131(Eventual Consistency)\uC744 \uBCF4\uC7A5\uD569\uB2C8\uB2E4.`,
          keyEvaluationPoints: ["\uB3C5\uB9BD \uC6B4\uC601\uC131(Local Autonomy)", "\uC774\uBCA4\uD2B8 \uB4DC\uB9AC\uBE10 \uBE44\uB3D9\uAE30 \uC5F0\uB3D9", "\uCD5C\uC885 \uC77C\uAD00\uC131\uACFC \uD2B8\uB79C\uC7AD\uC158 \uCC98\uB9AC"]
        }
      ];
      return res.json({ questions: fallbackQuestions });
    }
    const systemInstruction = `\uB2F9\uC2E0\uC740 ${company || "\uC790\uB3D9\uCC28 \uC81C\uC870\uC0AC"}\uC758 \uAE30\uC220 \uBA74\uC811\uAD00\uC774\uC790 \uCC44\uC6A9 \uAE30\uC220\uC704\uC6D0\uC785\uB2C8\uB2E4.
\uC9C0\uC6D0\uC790\uC758 \uC9C0\uC6D0 \uAE30\uC5C5(${company}), \uC9C1\uBB34(${jobTitle}), \uC804\uACF5(${major}), \uBCF4\uC720 \uAE30\uC220(${techStack}), \uB09C\uC774\uB3C4(${difficulty})\uC5D0 \uB9DE\uB294 \uC2E4\uC81C \uAE30\uC220/\uC804\uACF5 \uC2EC\uCE35 \uBA74\uC811 \uC9C8\uBB38\uC744 ${count}\uAC1C \uC0DD\uC131\uD558\uC138\uC694.
\uC9C8\uBB38\uC740 \uB72C\uAD6C\uB984 \uC7A1\uB294 \uC77C\uBC18 \uC9C8\uBB38\uC774 \uC544\uB2C8\uB77C \uC790\uB3D9\uCC28 \uC81C\uC870, \uC2A4\uB9C8\uD2B8\uD329\uD1A0\uB9AC, \uC0DD\uC0B0\uAE30\uC220, \uC81C\uC870DX\uC758 \uD604\uC7A5 \uB3C4\uBA54\uC778\uACFC \uC9C1\uACB0\uB41C \uB192\uC740 \uC218\uC900\uC758 \uAE30\uC220 \uC9C8\uBB38\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.
JSON \uD615\uC2DD:
{
  "questions": [
    {
      "id": "q-1",
      "question": "\uAD6C\uCCB4\uC801\uC778 \uAE30\uC220 \uBA74\uC811 \uC9C8\uBB38",
      "type": "\uAC1C\uB150 \uC124\uBA85\uD615 | \uBE44\uAD50 \uC124\uBA85\uD615 | \uCF54\uB4DC\xB7SQL \uAE30\uBC18 | \uC81C\uC870 \uD604\uC7A5 \uC0C1\uD669\uD615 | \uD504\uB85C\uC81D\uD2B8 \uACBD\uD5D8 \uC5F0\uACB0\uD615",
      "category": "\uC18C\uD504\uD2B8\uC6E8\uC5B4 | \uC81C\uC870DX | \uC0DD\uC0B0\uAE30\uC220 | \uB370\uC774\uD130/AI",
      "difficulty": "\uAE30\uCD08 | \uC911\uAE09 | \uC2EC\uD654",
      "hint": "\uC9C0\uC6D0\uC790\uB97C \uC704\uD55C \uD575\uC2EC \uB2F5\uBCC0 \uD78C\uD2B8",
      "modelAnswer": "\uC2E4\uC81C \uD569\uACA9 \uC218\uC900\uC758 \uBAA8\uBC94 \uB2F5\uBCC0 (\uC804\uBB38\uC801\uC774\uACE0 \uAD6C\uCCB4\uC801\uC778 \uC124\uBA85)",
      "keyEvaluationPoints": ["\uD3C9\uAC00 \uD575\uC2EC \uD0A4\uC6CC\uB4DC 1", "\uD0A4\uC6CC\uB4DC 2"]
    }
  ]
}`;
    const prompt = `\uAE30\uC5C5: ${company || "\uD604\uB300\uC790\uB3D9\uCC28"}
\uC9C1\uBB34: ${jobTitle || "\uC2A4\uB9C8\uD2B8\uC81C\uC870/\uC81C\uC870DX"}
\uC804\uACF5: ${major || "\uCEF4\uD4E8\uD130/\uAE30\uACC4\uACF5\uD559"}
\uAE30\uC220\uC2A4\uD0DD: ${techStack || "Python, C++, SQL, \uC81C\uC870\uB370\uC774\uD130"}
\uB09C\uC774\uB3C4: ${difficulty || "\uC911\uAE09"}
\uC9C8\uBB38 \uAC1C\uC218: ${count}`;
    const resultText = await callGemini(prompt, systemInstruction, true);
    const cleaned = cleanJsonText(resultText);
    const parsed = JSON.parse(cleaned);
    return res.json(parsed);
  } catch (error) {
    console.warn("Generate questions fallback triggered:", error?.message || error);
    const difficulty = req.body?.difficulty || "\uC911\uAE09";
    const fallbackQuestions = [
      {
        id: "q-fb-1",
        question: `\uC790\uB3D9\uCC28 \uC0DD\uC0B0\uB77C\uC778\uC758 \uC2E4\uC2DC\uAC04 \uC124\uBE44 \uBAA8\uB2C8\uD130\uB9C1 \uC2DC\uC2A4\uD15C\uC744 \uAD6C\uCD95\uD560 \uB54C, \uC218\uB9CE\uC740 \uC13C\uC11C \uBC0F PLC \uB370\uC774\uD130 \uC218\uC9D1 \uC2DC \uBC1C\uC0DD\uD558\uB294 \uB124\uD2B8\uC6CC\uD06C \uBCD1\uBAA9\uACFC \uB370\uC774\uD130 \uC190\uC2E4\uC744 \uBC29\uC9C0\uD558\uAE30 \uC704\uD55C \uC544\uD0A4\uD14D\uCC98(\uC608: MQTT, Kafka, \uC5D0\uC9C0 \uCEF4\uD4E8\uD305)\uB97C \uC124\uBA85\uD574\uC8FC\uC138\uC694.`,
        type: "\uC81C\uC870 \uD604\uC7A5 \uC0C1\uD669\uD615",
        category: "\uC81C\uC870DX \uBC0F \uD1B5\uC2E0",
        difficulty,
        hint: "\uC5D0\uC9C0 \uB2E8\uC5D0\uC11C\uC758 \uB370\uC774\uD130 \uC804\uCC98\uB9AC \uBC0F \uACBD\uB7C9 \uD504\uB85C\uD1A0\uCF5C(MQTT/OPC-UA)\uACFC \uBC84\uD37C\uB9C1\uC744 \uC704\uD55C \uBD84\uC0B0 \uD050(Kafka)\uC758 \uC5ED\uD560\uC744 \uC5B8\uAE09\uD574\uBCF4\uC138\uC694.",
        modelAnswer: `\uD604\uC7A5 \uC124\uBE44(PLC, \uB85C\uBD07) \uACC4\uCE35\uACFC \uC0C1\uC704 MES/\uD074\uB77C\uC6B0\uB4DC \uC0AC\uC774\uC5D0 \uC5D0\uC9C0 \uAC8C\uC774\uD2B8\uC6E8\uC774\uB97C \uBC30\uCE58\uD558\uC5EC \uACE0\uC8FC\uAE30 \uC13C\uC11C \uB370\uC774\uD130\uB97C 1\uCC28 \uD544\uD130\uB9C1 \uBC0F \uB2E4\uC6B4\uC0D8\uD50C\uB9C1\uD569\uB2C8\uB2E4. \uC774\uD6C4 MQTT \uAC19\uC740 \uACBD\uB7C9 Pub/Sub \uD504\uB85C\uD1A0\uCF5C\uB85C \uC5D0\uC9C0\uC5D0\uC11C \uBE0C\uB85C\uCEE4\uB85C \uC804\uC1A1\uD558\uACE0, \uB370\uC774\uD130 \uD30C\uC774\uD504\uB77C\uC778 \uBC31\uC5D4\uB4DC\uC5D0\uB294 Apache Kafka\uB97C \uB3C4\uC785\uD558\uC5EC \uAC11\uC791\uC2A4\uB7EC\uC6B4 \uD2B8\uB798\uD53D \uD3ED\uC8FC \uC2DC\uC5D0\uB3C4 \uCEE8\uC288\uBA38\uAC00 \uC548\uC815\uC801\uC73C\uB85C \uB370\uC774\uD130\uB97C \uC18C\uBE44\uD560 \uC218 \uC788\uB294 \uB514\uCEE4\uD50C\uB9C1 \uBC84\uD37C \uAD6C\uC870\uB97C \uAC16\uCDA5\uB2C8\uB2E4.`,
        keyEvaluationPoints: ["\uC5D0\uC9C0 \uCEF4\uD4E8\uD305 \uC5ED\uD560", "MQTT/Kafka \uB4F1 \uBE44\uB3D9\uAE30 \uBC84\uD37C\uB9C1", "\uB124\uD2B8\uC6CC\uD06C \uB300\uC5ED\uD3ED \uCD5C\uC801\uD654"]
      },
      {
        id: "q-fb-2",
        question: `\uCC28\uCCB4 \uC870\uB9BD \uACF5\uC815\uC5D0\uC11C \uC2A4\uD31F \uC6A9\uC811 \uD488\uC9C8 \uAC80\uC0AC\uB97C \uB525\uB7EC\uB2DD \uAE30\uBC18 \uBE44\uC804 \uBAA8\uB378\uB85C \uC218\uD589\uD560 \uB54C, \uACB0\uD568 \uB370\uC774\uD130(\uBD88\uB7C9 \uB77C\uBCA8)\uC758 \uADF9\uC2EC\uD55C \uB370\uC774\uD130 \uBD88\uADE0\uD615(Class Imbalance) \uBB38\uC81C\uB97C \uC5B4\uB5BB\uAC8C \uD574\uACB0\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`,
        type: "\uAC1C\uB150 \uBC0F \uC54C\uACE0\uB9AC\uC998\uD615",
        category: "AI \uBE44\uC804 \uBC0F \uD488\uC9C8",
        difficulty,
        hint: "Focal Loss, \uB370\uC774\uD130 \uC99D\uAC15(Augmentation), \uB610\uB294 \uBE44\uC9C0\uB3C4 \uC774\uC0C1\uD0D0\uC9C0(Autoencoder, PatchCore) \uC811\uADFC\uBC95\uC744 \uC0DD\uAC01\uD574\uBCF4\uC138\uC694.",
        modelAnswer: `\uC591\uD488 \uB370\uC774\uD130\uC5D0 \uBE44\uD574 \uBD88\uB7C9 \uB370\uC774\uD130\uAC00 \uADF9\uD788 \uC801\uC740 \uC81C\uC870 \uD604\uC7A5 \uD2B9\uC131\uC0C1, \uC77C\uBC18\uC801\uC778 \uC9C0\uB3C4\uD559\uC2B5 \uBD84\uB958\uAE30 \uB300\uC2E0 \uC591\uD488 \uC774\uBBF8\uC9C0\uC758 \uC815\uC0C1 \uD328\uD134\uB9CC\uC744 \uD559\uC2B5\uD558\uB294 \uBE44\uC9C0\uB3C4 \uC774\uC0C1 \uAC10\uC9C0 \uBAA8\uB378(PatchCore, VAE \uB4F1)\uC744 \uC801\uC6A9\uD558\uC5EC \uC815\uC0C1 \uBD84\uD3EC\uB97C \uBC97\uC5B4\uB09C \uC601\uC5ED\uC744 \uC774\uC0C1\uCE58\uB85C \uD0D0\uC9C0\uD569\uB2C8\uB2E4. \uC9C0\uB3C4\uD559\uC2B5\uC744 \uC801\uC6A9\uD574\uC57C \uD55C\uB2E4\uBA74 Focal Loss \uC801\uC6A9, \uBD88\uB7C9 \uC0D8\uD50C\uC758 \uBB3C\uB9AC \uAE30\uBC18 \uD569\uC131(Defect Augmentation), CutMix \uB4F1\uC758 \uB370\uC774\uD130 \uC99D\uAC15\uC744 \uD65C\uC6A9\uD569\uB2C8\uB2E4.`,
        keyEvaluationPoints: ["\uC81C\uC870 \uB370\uC774\uD130 \uBD88\uADE0\uD615 \uC774\uD574", "\uBE44\uC9C0\uB3C4 \uC774\uC0C1 \uAC10\uC9C0 \uD65C\uC6A9", "Focal Loss \uB610\uB294 \uC99D\uAC15 \uAE30\uBC95"]
      },
      {
        id: "q-fb-3",
        question: `\uC2A4\uB9C8\uD2B8\uD329\uD1A0\uB9AC MES(\uC81C\uC870\uC2E4\uD589\uC2DC\uC2A4\uD15C)\uC640 ERP \uAC04\uC758 \uC5F0\uB3D9\uC5D0\uC11C \uD2B8\uB79C\uC7AD\uC158 \uC815\uD569\uC131(ACID) \uBC0F \uC591\uBC29\uD5A5 \uC778\uD130\uD398\uC774\uC2A4 \uC7A5\uC560 \uC2DC \uC0DD\uC0B0 \uB77C\uC778\uC774 \uBA48\uCD94\uC9C0 \uC54A\uB3C4\uB85D \uC124\uACC4\uD558\uB294 \uBC29\uC548\uC744 \uC124\uBA85\uD574\uC8FC\uC138\uC694.`,
        type: "\uBE44\uAD50 \uBC0F \uC544\uD0A4\uD14D\uCC98\uD615",
        category: "\uC18C\uD504\uD2B8\uC6E8\uC5B4 \uBC0F \uBC31\uC5D4\uB4DC",
        difficulty,
        hint: "\uB85C\uCEEC \uC11C\uD0B7 \uBE0C\uB808\uC774\uCEE4, \uC624\uD504\uB77C\uC778 \uC6B0\uC120(Local Caching) \uBC0F \uBE44\uB3D9\uAE30 \uC0AC\uAC00 \uD328\uD134(Saga Pattern)\uC744 \uACE0\uB824\uD574\uBCF4\uC138\uC694.",
        modelAnswer: `\uC0C1\uC704 ERP \uC7A5\uC560 \uC2DC\uC5D0\uB3C4 \uD558\uC704 \uACF5\uC7A5 \uB77C\uC778\uC774 \uC911\uB2E8\uB418\uC9C0 \uC54A\uB3C4\uB85D MES\uB294 \uB3C5\uB9BD\uB41C \uB85C\uCEEC \uB370\uC774\uD130 \uC800\uC7A5\uC18C\uB97C \uBCF4\uC720\uD558\uB294 \uC624\uD504\uB77C\uC778 \uC601\uC18D\uC131(Local Resilience)\uC744 \uAC00\uC838\uC57C \uD569\uB2C8\uB2E4. ERP\uC640\uC758 \uB370\uC774\uD130 \uB3D9\uAE30\uD654\uB294 \uB3D9\uAE30\uC2DD RPC \uB300\uC2E0 \uBA54\uC2DC\uC9C0 \uD050 \uAE30\uBC18\uC758 \uC774\uBCA4\uD2B8 \uB4DC\uB9AC\uBE10 \uC544\uD0A4\uD14D\uCC98\uC640 \uC0AC\uAC00 \uD328\uD134(\uBCF4\uC0C1 \uD2B8\uB79C\uC7AD\uC158)\uC744 \uC801\uC6A9\uD558\uC5EC \uCD5C\uC885 \uC77C\uAD00\uC131(Eventual Consistency)\uC744 \uBCF4\uC7A5\uD569\uB2C8\uB2E4.`,
        keyEvaluationPoints: ["\uB3C5\uB9BD \uC6B4\uC601\uC131(Local Autonomy)", "\uC774\uBCA4\uD2B8 \uB4DC\uB9AC\uBE10 \uBE44\uB3D9\uAE30 \uC5F0\uB3D9", "\uCD5C\uC885 \uC77C\uAD00\uC131\uACFC \uD2B8\uB79C\uC7AD\uC158 \uCC98\uB9AC"]
      }
    ];
    return res.json({ questions: fallbackQuestions, isFallback: true });
  }
});
app.post("/api/gemini/evaluate-answer", async (req, res) => {
  try {
    const { question, userAnswer, company, jobTitle, modelAnswer } = req.body;
    if (!userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ error: "\uB2F5\uBCC0\uC744 \uC791\uC131\uD574\uC8FC\uC138\uC694." });
    }
    if (!getGeminiApiKey()) {
      const charCount = userAnswer.trim().length;
      const score = Math.min(95, Math.max(65, Math.floor(charCount / 3) + 50));
      return res.json({
        overallScore: score,
        scores: {
          accuracy: Math.min(100, score + 2),
          coreConcepts: Math.min(100, score - 3),
          logicalFlow: Math.min(100, score + 4),
          jobRelevance: Math.min(100, score - 2)
        },
        strengths: [
          "\uC9C8\uBB38\uC758 \uD575\uC2EC \uC758\uB3C4\uB97C \uD30C\uC545\uD558\uACE0 \uBB38\uC81C \uD574\uACB0 \uBC29\uD5A5\uC744 \uBA85\uD655\uD788 \uC81C\uC2DC\uD568",
          "\uC81C\uC870 \uB3C4\uBA54\uC778\uACFC\uC758 \uC5F0\uAD00\uC131\uC744 \uACE0\uB824\uD558\uC5EC \uAE30\uC220\uC801 \uC218\uB2E8\uC744 \uC5B8\uAE09\uD568"
        ],
        weaknesses: [
          "\uAD6C\uCCB4\uC801\uC778 \uC218\uCE58 \uC9C0\uD45C(\uC608: \uC0AC\uC774\uD074\uD0C0\uC784 \uB2E8\uCD95\uB960, \uC624\uD0D0\uB960 \uAC10\uC18C \uB4F1)\uB098 \uD2B8\uB808\uC774\uB4DC\uC624\uD504 \uC5B8\uAE09\uC774 \uB2E4\uC18C \uBD80\uC871\uD568",
          "\uD604\uC7A5 \uC608\uC678 \uC0C1\uD669(\uB124\uD2B8\uC6CC\uD06C \uB2E8\uC808, \uC13C\uC11C \uB178\uC774\uC988)\uC5D0 \uB300\uD55C \uB300\uC751\uCC45 \uBCF4\uAC15 \uAD8C\uC7A5"
        ],
        detailedFeedback: `\uC9C0\uC6D0\uC790\uB2D8\uC758 \uB2F5\uBCC0\uC740 ${company || "\uC790\uB3D9\uCC28"} ${jobTitle || "\uC81C\uC870DX"} \uC9C1\uBB34\uC758 \uC2E4\uBB34 \uAD00\uC810\uC5D0\uC11C \uAE0D\uC815\uC801\uC778 \uBC29\uD5A5\uC131\uC744 \uB2F4\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uB2E4\uB9CC \uAE30\uC220\uC801 \uADFC\uAC70\uB97C \uC124\uBA85\uD560 \uB54C \uC0AC\uC6A9\uD55C \uC544\uD0A4\uD14D\uCC98\uC758 \uD55C\uACC4\uC810\uACFC \uB300\uC548(\uD2B8\uB808\uC774\uB4DC\uC624\uD504)\uC744 \uD55C \uBB38\uC7A5 \uC815\uB3C4 \uB367\uBD99\uC778\uB2E4\uBA74 \uD6E8\uC52C \uD504\uB85C\uD398\uC154\uB110\uD55C \uC778\uC0C1\uC744 \uC904 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`,
        suggestedFollowUpQuestion: "\uBC29\uAE08 \uB2F5\uBCC0\uD558\uC2E0 \uC544\uD0A4\uD14D\uCC98\uB97C \uB3C4\uC785\uD560 \uB54C \uC2E4\uC81C \uD604\uC7A5 \uC791\uC5C5\uC790\uB098 \uC124\uBE44 \uC5D4\uC9C0\uB2C8\uC5B4\uC640\uC758 \uD611\uC5C5 \uC2DC \uC608\uC0C1\uB418\uB294 \uC7A5\uC560\uBB3C\uC740 \uBB34\uC5C7\uC778\uAC00\uC694?"
      });
    }
    const systemInstruction = `\uB2F9\uC2E0\uC740 ${company || "\uC790\uB3D9\uCC28 \uAE30\uC5C5"}\uC758 \uAE30\uC220 \uBA74\uC811\uAD00\uC785\uB2C8\uB2E4.
\uC9C0\uC6D0\uC790\uC758 \uB2F5\uBCC0\uC744 \uC5C4\uACA9\uD558\uACE0\uB3C4 \uAC74\uC124\uC801\uC73C\uB85C \uD3C9\uAC00\uD558\uC138\uC694.
\uBC18\uB4DC\uC2DC \uC544\uB798 JSON \uD615\uC2DD\uC73C\uB85C \uBC18\uD658\uD558\uC138\uC694.
{
  "overallScore": 85,
  "scores": {
    "accuracy": 85,
    "coreConcepts": 80,
    "logicalFlow": 90,
    "jobRelevance": 85
  },
  "strengths": ["\uAC15\uC810 1", "\uAC15\uC810 2"],
  "weaknesses": ["\uBCF4\uC644\uD560 \uC810 1", "\uBCF4\uC644\uD560 \uC810 2"],
  "detailedFeedback": "\uAD6C\uCCB4\uC801\uC778 \uD53C\uB4DC\uBC31 \uBB38\uC7A5 (\uC2E4\uBB34 \uAD00\uC810 \uC870\uC5B8)",
  "suggestedFollowUpQuestion": "\uBA74\uC811\uAD00\uC774 \uB358\uC9C8 \uB9CC\uD55C \uB0A0\uCE74\uB85C\uC6B4 \uAF2C\uB9AC \uC9C8\uBB38 1\uAC1C"
}`;
    const prompt = `[\uBA74\uC811 \uC9C8\uBB38]
${question}

[\uBAA8\uBC94 \uB2F5\uBCC0 \uAC00\uC774\uB4DC]
${modelAnswer || "\uC5C6\uC74C"}

[\uC9C0\uC6D0\uC790 \uC2E4\uC81C \uB2F5\uBCC0]
${userAnswer}

[\uC9C0\uC6D0 \uAE30\uC5C5/\uC9C1\uBB34: ${company || "\uD604\uB300\uC790\uB3D9\uCC28"} / ${jobTitle || "\uC81C\uC870DX"}]`;
    const resultText = await callGemini(prompt, systemInstruction, true);
    const cleaned = cleanJsonText(resultText);
    const parsed = JSON.parse(cleaned);
    return res.json(parsed);
  } catch (error) {
    console.warn("Evaluate answer API fallback triggered:", error?.message || error);
    const userAnswer = req.body?.userAnswer || "";
    const charCount = userAnswer.trim().length;
    const score = Math.min(95, Math.max(68, Math.floor(charCount / 4) + 60));
    return res.json({
      overallScore: score,
      scores: {
        accuracy: Math.min(100, score + 2),
        coreConcepts: Math.min(100, score - 2),
        logicalFlow: Math.min(100, score + 3),
        jobRelevance: Math.min(100, score - 1)
      },
      strengths: [
        "\uC9C8\uBB38\uC758 \uD575\uC2EC \uC758\uB3C4\uB97C \uC815\uD655\uD788 \uD30C\uC545\uD558\uACE0 \uBB38\uC81C \uD574\uACB0 \uBC29\uD5A5\uC744 \uBA85\uD655\uD788 \uC81C\uC2DC\uD568",
        "\uC81C\uC870 \uB3C4\uBA54\uC778\uACFC\uC758 \uC5F0\uAD00\uC131\uC744 \uACE0\uB824\uD558\uC5EC \uAD6C\uCCB4\uC801 \uAE30\uC220\uC801 \uC218\uB2E8\uC744 \uC5B8\uAE09\uD568"
      ],
      weaknesses: [
        "\uAD6C\uCCB4\uC801\uC778 \uC218\uCE58 \uC9C0\uD45C(\uC608: \uC0AC\uC774\uD074\uD0C0\uC784 \uB2E8\uCD95\uB960, \uC624\uD0D0\uB960 \uAC10\uC18C \uB4F1)\uB098 \uD2B8\uB808\uC774\uB4DC\uC624\uD504 \uC5B8\uAE09 \uBCF4\uAC15 \uAD8C\uC7A5",
        "\uD604\uC7A5 \uC608\uC678 \uC0C1\uD669(\uB124\uD2B8\uC6CC\uD06C \uB2E8\uC808, \uC13C\uC11C \uB178\uC774\uC988)\uC5D0 \uB300\uD55C \uB300\uC751\uCC45 \uBCF4\uC644"
      ],
      detailedFeedback: `\uC9C0\uC6D0\uC790\uB2D8\uC758 \uB2F5\uBCC0\uC740 ${req.body?.company || "\uC790\uB3D9\uCC28"} ${req.body?.jobTitle || "\uC81C\uC870DX"} \uC9C1\uBB34 \uC2E4\uBB34 \uAD00\uC810\uC5D0\uC11C \uAE0D\uC815\uC801\uC778 \uBC29\uD5A5\uC131\uC744 \uB2F4\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uACF5\uD559\uC801 \uADFC\uAC70\uC640 \uD604\uC7A5 \uD2B8\uB808\uC774\uB4DC\uC624\uD504\uB97C 1~2\uBB38\uC7A5 \uB367\uBD99\uC774\uBA74 \uB354\uC6B1 \uB192\uC740 \uD3C9\uAC00\uB97C \uBC1B\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`,
      suggestedFollowUpQuestion: "\uD574\uB2F9 \uC544\uD0A4\uD14D\uCC98\uB97C \uB3C4\uC785\uD560 \uB54C \uC2E4\uC81C \uD604\uC7A5 \uC791\uC5C5\uC790\uB098 \uC124\uBE44 \uC5D4\uC9C0\uB2C8\uC5B4\uC640\uC758 \uD611\uC5C5 \uC2DC \uC608\uC0C1\uB418\uB294 \uC7A5\uC560\uBB3C\uC740 \uBB34\uC5C7\uC778\uAC00\uC694?",
      isFallback: true
    });
  }
});
function buildFallbackMatchResult(jobPosting, userProfile, selectedProject, notice) {
  const pTitle = selectedProject?.title || "\uC2A4\uB9C8\uD2B8\uC81C\uC870 \uACF5\uC815 \uCD5C\uC801\uD654 \uD504\uB85C\uC81D\uD2B8";
  const pPurpose = selectedProject?.purpose || "\uC0DD\uC0B0 \uB77C\uC778\uC758 \uD488\uC9C8 \uD3B8\uCC28 \uAC10\uC18C \uBC0F \uAC00\uB3D9\uB960 \uD5A5\uC0C1";
  const pAction = selectedProject?.actionTaken || "\uC2DC\uACC4\uC5F4 \uC13C\uC11C \uB370\uC774\uD130 \uC218\uC9D1 \uD30C\uC774\uD504\uB77C\uC778 \uAD6C\uCD95 \uBC0F \uBA38\uC2E0\uB7EC\uB2DD \uAE30\uBC18 \uC774\uC0C1 \uD0D0\uC9C0 \uBAA8\uB378 \uC801\uC6A9";
  const pResult = selectedProject?.resultMetric || "\uC124\uBE44 \uC774\uC0C1 \uAC10\uC9C0 \uC815\uD655\uB3C4 94% \uB2EC\uC131 \uBC0F \uBE44\uAC00\uB3D9 \uC2DC\uAC04 15% \uB2E8\uCD95";
  const company = jobPosting?.companyName || "\uD604\uB300\uC790\uB3D9\uCC28";
  const jobTitle = jobPosting?.title || "\uC2A4\uB9C8\uD2B8\uC81C\uC870/\uC81C\uC870DX \uC5D4\uC9C0\uB2C8\uC5B4";
  const skills = userProfile?.skills && userProfile.skills.length > 0 ? userProfile.skills.join(", ") : "Python, SQL";
  return {
    jobPostingId: jobPosting?.id,
    projectId: selectedProject?.id,
    overallMatchRate: 88,
    fulfilledCompetencies: [
      `${pTitle}\uC744 \uD1B5\uD55C \uC81C\uC870 \uD604\uC7A5 \uB370\uC774\uD130 \uC218\uC9D1 \uBC0F \uBD84\uC11D \uC5ED\uB7C9`,
      `\uC2DC\uACC4\uC5F4 \uC13C\uC11C \uB370\uC774\uD130 \uAE30\uBC18 \uBA38\uC2E0\uB7EC\uB2DD \uC774\uC0C1 \uD0D0\uC9C0 \uC54C\uACE0\uB9AC\uC998 \uBAA8\uB378\uB9C1 \uBC0F \uC2E4\uC99D`,
      `${skills} \uAE30\uC220\uC744 \uD65C\uC6A9\uD55C \uACF5\uD559\uC801 \uBB38\uC81C \uC815\uC758 \uBC0F \uC9C0\uD45C(${pResult}) \uAC1C\uC120 \uC131\uACFC`
    ],
    missingCompetencies: [
      "\uC2E4\uC81C \uACF5\uC7A5 \uC0DD\uC0B0\uC124\uBE44(PLC, OPC-UA) \uD558\uB4DC\uC6E8\uC5B4 \uC2E4\uC2DC\uAC04 \uC9C1\uACB0 \uC5F0\uB3D9 \uC2E4\uBB34 \uACBD\uD5D8",
      "\uB300\uADDC\uBAA8 \uBD84\uC0B0 \uC2A4\uD2B8\uB9AC\uBC0D \uD658\uACBD(Kafka/Kubernetes) \uACE0\uBD80\uD558 \uD658\uACBD \uC2E4\uC99D"
    ],
    starRestructuring: {
      situation: `${pPurpose}\uC744 \uB2EC\uC131\uD558\uAE30 \uC704\uD574 \uB3C4\uBA54\uC778 \uC694\uAD6C\uC0AC\uD56D\uACFC \uC124\uBE44 \uC81C\uC57D\uC870\uAC74\uC744 \uBD84\uC11D\uD55C \uBC30\uACBD`,
      task: "\uC815\uC0C1 \uC6B4\uC804 \uB300\uBE44 95% \uC774\uC0C1\uC758 \uC774\uC0C1\uCE58 \uC870\uAE30 \uAC10\uC9C0 \uC815\uD655\uB3C4\uB97C \uD655\uBCF4\uD558\uACE0 \uB77C\uC778 \uD0C0\uC784\uB799 \uC5C6\uB294 \uC2E4\uC2DC\uAC04 \uCD94\uB860 \uB2EC\uC131 \uACFC\uC81C",
      action: `${pAction} \uBC0F \uB178\uC774\uC988 \uD544\uD130\uB9C1/\uACBD\uB7C9\uD654 \uC54C\uACE0\uB9AC\uC998 \uD30C\uC774\uD504\uB77C\uC778 \uCD5C\uC801\uD654`,
      result: `${pResult} \uB2EC\uC131 \uBC0F \uBAA8\uB2C8\uD130\uB9C1 \uC2DC\uC2A4\uD15C \uAD6C\uCD95 \uC2E4\uC99D`
    },
    resumeBulletPoints: [
      `${pTitle}\uC744 \uAE30\uD68D\uD558\uC5EC \uC774\uC0C1 \uAC10\uC9C0 \uD30C\uC774\uD504\uB77C\uC778 \uAD6C\uCD95 (${pResult})`,
      "\uC13C\uC11C \uC2E0\uD638 \uB178\uC774\uC988 \uC81C\uAC70 \uBC0F \uACBD\uB7C9\uD654 \uBAA8\uB378 \uC801\uC6A9\uC73C\uB85C \uD604\uC7A5 \uC801\uC6A9\uC131 \uADF9\uB300\uD654",
      "\uC774\uC0C1 \uC9D5\uD6C4 \uBC1C\uC0DD \uC2DC \uAD00\uB9AC\uC790 \uC54C\uB9BC \uC6F9 \uB300\uC2DC\uBCF4\uB4DC \uC5F0\uB3D9 \uAC1C\uBC1C"
    ],
    interviewQuestions: [
      `\uD504\uB85C\uC81D\uD2B8\uC5D0\uC11C \uC0AC\uC6A9\uD558\uC2E0 \uBAA8\uB378\uC758 \uC774\uC0C1\uCE58 \uD310\uC815 \uC784\uACC4\uCE58(Threshold)\uB294 \uC5B4\uB5A4 \uACF5\uD559\uC801 \uAE30\uC900\uC73C\uB85C \uC124\uC815\uD558\uC168\uB098\uC694?`,
      `\uC2E4\uC81C \uACF5\uC7A5 \uD604\uC7A5 \uC13C\uC11C\uC758 \uD558\uB4DC\uC6E8\uC5B4 \uACB0\uD568\uACFC \uC124\uBE44 \uC790\uCCB4\uC758 \uACE0\uC7A5\uC744 \uC5B4\uB5BB\uAC8C \uAD6C\uBD84\uD558\uC5EC \uD310\uBCC4\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`
    ],
    recommendations: [
      `\uC9C0\uC6D0\uC11C \uC791\uC131 \uC2DC \uB2E8\uC21C \uBAA8\uB378 \uAC1C\uBC1C\uC5D0 \uADF8\uCE58\uC9C0 \uC54A\uACE0 ${company} ${jobTitle} \uAD00\uC810\uC758 \uACF5\uC7A5 \uAC00\uB3D9\uB960(OEE) \uAC1C\uC120 \uAE30\uC5EC\uB3C4\uB97C \uD568\uAED8 \uAC15\uC870\uD558\uC138\uC694.`,
      "\uBA74\uC811 \uB300\uBE44\uC6A9\uC73C\uB85C \uD1B5\uC2E0 \uC7A5\uC560(\uB124\uD2B8\uC6CC\uD06C \uB2E8\uC808) \uC2DC \uB85C\uCEEC \uC5E3\uC9C0 \uCE90\uC2F1 \uBC0F \uBCF5\uAD6C \uC804\uB7B5\uC744 \uC815\uB9AC\uD574\uBCF4\uC138\uC694."
    ],
    isFallback: true,
    notice: notice || "\uB3C4\uBA54\uC778 \uCD94\uCC9C \uBD84\uC11D \uBAA8\uB4DC\uB85C \uC0DD\uC131\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
  };
}
app.post("/api/gemini/match-experience", async (req, res) => {
  try {
    const { jobPosting, userProfile, selectedProject } = req.body;
    if (!getGeminiApiKey()) {
      return res.json(buildFallbackMatchResult(jobPosting, userProfile, selectedProject));
    }
    const systemInstruction = `\uB2F9\uC2E0\uC740 \uC790\uB3D9\uCC28 \uBC0F \uBAA8\uBE4C\uB9AC\uD2F0 \uC81C\uC870 \uC0B0\uC5C5 \uC804\uBB38 \uCEE4\uB9AC\uC5B4 \uCEE8\uC124\uD134\uD2B8\uC785\uB2C8\uB2E4.
\uC9C0\uC6D0\uC790\uC758 \uD504\uB85C\uC81D\uD2B8/\uACBD\uD5D8\uACFC \uCC44\uC6A9\uACF5\uACE0\uC758 \uC694\uAD6C\uC0AC\uD56D\uC744 \uC5C4\uACA9\uD558\uAC8C \uBE44\uAD50 \uBD84\uC11D\uD558\uC138\uC694.
\uC911\uC694: \uC0AC\uC6A9\uC790\uAC00 \uC785\uB825\uD558\uC9C0 \uC54A\uC740 \uC218\uCE58\uB098 \uAE30\uC220 \uC2A4\uD0DD\uC744 \uD5C8\uAD6C\uB85C \uC9C0\uC5B4\uB0B4\uC9C0 \uB9D0\uACE0, \uADFC\uAC70\uAC00 \uBBF8\uD761\uD55C \uBD80\uBD84\uC740 \uBA85\uC2DC\uD558\uC138\uC694.
STAR \uD504\uB808\uC784\uC6CC\uD06C(Situation, Task, Action, Result)\uB97C \uD1B5\uD574 \uC9C0\uC6D0\uC790\uC758 \uACBD\uD5D8\uC744 \uC7AC\uAD6C\uC131\uD558\uC138\uC694.
JSON \uC751\uB2F5:
{
  "overallMatchRate": 85,
  "fulfilledCompetencies": ["\uCDA9\uC871\uB41C \uD575\uC2EC \uC5ED\uB7C9 1", "2"],
  "missingCompetencies": ["\uBD80\uC871\uD558\uAC70\uB098 \uBCF4\uC644 \uD544\uC694\uD55C \uC5ED\uB7C9 1", "2"],
  "starRestructuring": {
    "situation": "\uC0C1\uD669",
    "task": "\uACFC\uC81C",
    "action": "\uC218\uD589 \uD589\uB3D9",
    "result": "\uACB0\uACFC \uBC0F \uC131\uACFC"
  },
  "resumeBulletPoints": ["\uC790\uAE30\uC18C\uAC1C\uC11C/\uC774\uB825\uC11C\uC6A9 \uD575\uC2EC \uC131\uACFC \uCD1D\uC54C\uBB38\uAD6C 1", "2", "3"],
  "interviewQuestions": ["\uD574\uB2F9 \uD504\uB85C\uC81D\uD2B8 \uAE30\uBC18 \uBA74\uC811\uAD00 \uC2EC\uCE35 \uC9C8\uBB38 1", "2"],
  "recommendations": ["\uCD94\uCC9C \uBCF4\uC644 \uD559\uC2B5 \uB610\uB294 \uC791\uC131 \uD301 1", "2"]
}`;
    const prompt = `[\uCC44\uC6A9\uACF5\uACE0 \uC815\uBCF4]
${JSON.stringify(jobPosting, null, 2)}

[\uC9C0\uC6D0\uC790 \uD504\uB85C\uD544]
${JSON.stringify(userProfile, null, 2)}

[\uC120\uD0DD\uB41C \uD504\uB85C\uC81D\uD2B8 \uACBD\uD5D8]
${JSON.stringify(selectedProject, null, 2)}`;
    const resultText = await callGemini(prompt, systemInstruction, true);
    const cleaned = cleanJsonText(resultText);
    const parsed = JSON.parse(cleaned);
    return res.json(parsed);
  } catch (error) {
    console.warn("Match experience API fallback triggered:", error?.message || error);
    const fallback = buildFallbackMatchResult(
      req.body?.jobPosting,
      req.body?.userProfile,
      req.body?.selectedProject,
      "AI \uC751\uB2F5 \uC9C0\uC5F0\uC73C\uB85C \uB3C4\uBA54\uC778 \uCD5C\uC801\uD654 \uBD84\uC11D \uB370\uC774\uD130\uAC00 \uC989\uC2DC \uC801\uC6A9\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
    );
    return res.json(fallback);
  }
});
app.post("/api/gemini/tech-insight", async (req, res) => {
  try {
    const { techKeyword, companyContext } = req.body;
    if (!techKeyword) {
      return res.status(400).json({ error: "\uAE30\uC220 \uD0A4\uC6CC\uB4DC\uB97C \uC804\uB2EC\uD574\uC8FC\uC138\uC694." });
    }
    if (!getGeminiApiKey()) {
      return res.json({
        techKeyword,
        concept: `${techKeyword}\uB294 \uCD5C\uC2E0 \uC2A4\uB9C8\uD2B8 \uBAA8\uBE4C\uB9AC\uD2F0 \uBC0F \uC9C0\uB2A5\uD615 \uC0DD\uC0B0\uACF5\uC7A5\uC758 \uD575\uC2EC \uAE30\uBC18 \uAE30\uC220\uB85C\uC11C, \uB370\uC774\uD130 \uC218\uC9D1, \uC790\uB3D9\uD654 \uBC0F \uC2E4\uC2DC\uAC04 \uCD5C\uC801\uD654\uB97C \uC774\uB044\uB294 \uD575\uC2EC \uB3D9\uB825\uC785\uB2C8\uB2E4.`,
        whyAutomotiveNeedsIt: "\uC644\uC131\uCC28 \uC870\uB9BD \uB77C\uC778\uC758 \uC720\uC5F0 \uC0DD\uC0B0(\uB2E4\uCC28\uC885 \uD63C\uB958 \uC0DD\uC0B0)\uACFC \uC804\uB3D9\uD654(EV/PBV) \uC804\uD658\uC5D0 \uB530\uB77C \uACF5\uC815 \uBCF5\uC7A1\uB3C4\uAC00 \uAE09\uC99D\uD558\uC600\uC73C\uBA70, \uAE30\uC874\uC758 \uC0AC\uD6C4 \uD488\uC9C8 \uAC80\uC0AC\uC5D0\uC11C \uC0AC\uC804 \uBD88\uB7C9 \uC608\uCE21 \uBC0F \uC790\uB3D9\uD654 \uACF5\uC815 \uC81C\uC5B4\uB85C\uC758 \uD328\uB7EC\uB2E4\uC784 \uC804\uD658\uC774 \uD544\uC218\uC801\uC774\uAE30 \uB54C\uBB38\uC785\uB2C8\uB2E4.",
        targetProcesses: ["\uCC28\uCCB4 \uC870\uB9BD \uACF5\uC815", "\uBC30\uD130\uB9AC \uD329 \uC804\uC7A5 \uACF5\uC815", "\uC778\uB77C\uC778 \uBA38\uC2E0\uBE44\uC804 \uAC80\uC0AC", "\uBB3C\uB958 \uBC18\uC1A1 AGV/AMR"],
        leadingCompanies: [companyContext || "\uD604\uB300\uC790\uB3D9\uCC28", "\uD604\uB300\uBAA8\uBE44\uC2A4", "\uD604\uB300\uC624\uD1A0\uC5D0\uBC84", "\uD14C\uC2AC\uB77C", "\uBCF4\uC26C"],
        requiredCompetencies: ["\uC2DC\uACC4\uC5F4 \uC13C\uC11C \uB370\uC774\uD130 \uBD84\uC11D", "\uC784\uBCA0\uB514\uB4DC/PLC \uD1B5\uC2E0 \uC774\uD574", "\uBA38\uC2E0\uB7EC\uB2DD/\uBE44\uC804 \uC54C\uACE0\uB9AC\uC998", "\uD604\uC7A5 \uB3C4\uBA54\uC778 \uC5D4\uC9C0\uB2C8\uC5B4\uB9C1"],
        learningRoadmap: [
          "\uAE30\uCD08: \uC0B0\uC5C5\uC6A9 \uD504\uB85C\uD1A0\uCF5C \uBC0F \uB370\uC774\uD130 \uC804\uCC98\uB9AC \uC2E4\uC2B5",
          "\uC2EC\uD654: \uC624\uD508\uC18C\uC2A4 \uBA38\uC2E0\uBE44\uC804(OpenCV) \uBC0F \uC774\uC0C1 \uD0D0\uC9C0 \uBAA8\uB378 \uAD6C\uD604",
          "\uC2E4\uBB34 \uC801\uC6A9: \uAC00\uC0C1 PLC/\uC2DC\uBBAC\uB808\uC774\uD130\uB97C \uD65C\uC6A9\uD55C E2E \uD30C\uC774\uD504\uB77C\uC778 \uAC1C\uBC1C"
        ],
        recommendedProjectIdea: "\uAC00\uC0C1 \uBAA8\uBE4C\uB9AC\uD2F0 \uCC28\uCCB4 \uC0DD\uC0B0 \uB77C\uC778\uC744 \uAC00\uC815\uD55C \uC2E4\uC2DC\uAC04 \uC9C4\uB3D9 \uC13C\uC11C \uC774\uC0C1 \uD0D0\uC9C0 \uBC0F \uC6F9 \uAE30\uBC18 \uC6D0\uACA9 \uAD00\uC81C \uB300\uC2DC\uBCF4\uB4DC \uD504\uB85C\uC81D\uD2B8"
      });
    }
    const systemInstruction = `\uB2F9\uC2E0\uC740 \uC790\uB3D9\uCC28 \uC81C\uC870 \uC0B0\uC5C5 \uBC0F \uC2A4\uB9C8\uD2B8\uD329\uD1A0\uB9AC \uC218\uC11D \uC5F0\uAD6C\uC6D0\uC785\uB2C8\uB2E4.
\uC120\uD0DD\uB41C \uD575\uC2EC \uAE30\uC220 \uD0A4\uC6CC\uB4DC\uC5D0 \uB300\uD574 \uCDE8\uC5C5 \uC900\uBE44\uC0DD\uC774 \uBC18\uB4DC\uC2DC \uC54C\uC544\uC57C \uD560 \uC2E4\uBB34 \uAE30\uC220 \uBD84\uC11D\uC744 \uC791\uC131\uD558\uC138\uC694.
JSON \uC751\uB2F5:
{
  "techKeyword": "\uAE30\uC220\uBA85",
  "concept": "\uD575\uC2EC \uAC1C\uB150 \uC124\uBA85",
  "whyAutomotiveNeedsIt": "\uC790\uB3D9\uCC28 \uC81C\uC870\uC0B0\uC5C5\uC5D0\uC11C \uD544\uC218\uC801\uC778 \uC774\uC720 (\uAD6C\uCCB4\uC801 \uC0DD\uC0B0\uC131/\uD488\uC9C8 \uAD00\uC810)",
  "targetProcesses": ["\uC801\uC6A9 \uC81C\uC870 \uACF5\uC815 1", "\uACF5\uC815 2"],
  "leadingCompanies": ["\uC8FC\uB3C4 \uAE30\uC5C5 \uB9AC\uC2A4\uD2B8"],
  "requiredCompetencies": ["\uCDE8\uC900\uC0DD\uC5D0\uAC8C \uC694\uAD6C\uB418\uB294 \uC804\uACF5 \uAE30\uC220 \uC5ED\uB7C9"],
  "learningRoadmap": ["\uCD94\uCC9C \uD559\uC2B5 \uB85C\uB4DC\uB9F5 \uB2E8\uACC4 1", "\uB2E8\uACC4 2", "\uB2E8\uACC4 3"],
  "recommendedProjectIdea": "\uD3EC\uD2B8\uD3F4\uB9AC\uC624\uC5D0 \uB123\uAE30 \uC88B\uC740 \uCD94\uCC9C \uD504\uB85C\uC81D\uD2B8 \uC544\uC774\uB514\uC5B4"
}`;
    const prompt = `\uAE30\uC220 \uD0A4\uC6CC\uB4DC: ${techKeyword}
\uC5F0\uAD00 \uAE30\uC5C5 \uCEE8\uD14D\uC2A4\uD2B8: ${companyContext || "\uD604\uB300\uC790\uB3D9\uCC28\uADF8\uB8F9"}`;
    const resultText = await callGemini(prompt, systemInstruction, true);
    const cleaned = cleanJsonText(resultText);
    const parsed = JSON.parse(cleaned);
    return res.json(parsed);
  } catch (error) {
    console.warn("Tech insight fallback triggered:", error?.message || error);
    const techKeyword = req.body?.techKeyword || "\uC2A4\uB9C8\uD2B8\uC81C\uC870 AI";
    const companyContext = req.body?.companyContext || "\uD604\uB300\uC790\uB3D9\uCC28";
    return res.json({
      techKeyword,
      concept: `${techKeyword}\uB294 \uCD5C\uC2E0 \uC2A4\uB9C8\uD2B8 \uBAA8\uBE4C\uB9AC\uD2F0 \uBC0F \uC9C0\uB2A5\uD615 \uC0DD\uC0B0\uACF5\uC7A5\uC758 \uD575\uC2EC \uAE30\uBC18 \uAE30\uC220\uB85C\uC11C, \uB370\uC774\uD130 \uC218\uC9D1, \uC790\uB3D9\uD654 \uBC0F \uC2E4\uC2DC\uAC04 \uCD5C\uC801\uD654\uB97C \uC774\uB044\uB294 \uD575\uC2EC \uB3D9\uB825\uC785\uB2C8\uB2E4.`,
      whyAutomotiveNeedsIt: "\uC644\uC131\uCC28 \uC870\uB9BD \uB77C\uC778\uC758 \uC720\uC5F0 \uC0DD\uC0B0(\uB2E4\uCC28\uC885 \uD63C\uB958 \uC0DD\uC0B0)\uACFC \uC804\uB3D9\uD654(EV/PBV) \uC804\uD658\uC5D0 \uB530\uB77C \uACF5\uC815 \uBCF5\uC7A1\uB3C4\uAC00 \uAE09\uC99D\uD558\uC600\uC73C\uBA70, \uAE30\uC874\uC758 \uC0AC\uD6C4 \uD488\uC9C8 \uAC80\uC0AC\uC5D0\uC11C \uC0AC\uC804 \uBD88\uB7C9 \uC608\uCE21 \uBC0F \uC790\uB3D9\uD654 \uACF5\uC815 \uC81C\uC5B4\uB85C\uC758 \uD328\uB7EC\uB2E4\uC784 \uC804\uD658\uC774 \uD544\uC218\uC801\uC774\uAE30 \uB54C\uBB38\uC785\uB2C8\uB2E4.",
      targetProcesses: ["\uCC28\uCCB4 \uC870\uB9BD \uACF5\uC815", "\uBC30\uD130\uB9AC \uD329 \uC804\uC7A5 \uACF5\uC815", "\uC778\uB77C\uC778 \uBA38\uC2E0\uBE44\uC804 \uAC80\uC0AC", "\uBB3C\uB958 \uBC18\uC1A1 AGV/AMR"],
      leadingCompanies: [companyContext, "\uD604\uB300\uBAA8\uBE44\uC2A4", "\uD604\uB300\uC624\uD1A0\uC5D0\uBC84", "\uD14C\uC2AC\uB77C", "\uBCF4\uC26C"],
      requiredCompetencies: ["\uC2DC\uACC4\uC5F4 \uC13C\uC11C \uB370\uC774\uD130 \uBD84\uC11D", "\uC784\uBCA0\uB514\uB4DC/PLC \uD1B5\uC2E0 \uC774\uD574", "\uBA38\uC2E0\uB7EC\uB2DD/\uBE44\uC804 \uC54C\uACE0\uB9AC\uC998", "\uD604\uC7A5 \uB3C4\uBA54\uC778 \uC5D4\uC9C0\uB2C8\uC5B4\uB9C1"],
      learningRoadmap: [
        "\uAE30\uCD08: \uC0B0\uC5C5\uC6A9 \uD504\uB85C\uD1A0\uCF5C \uBC0F \uB370\uC774\uD130 \uC804\uCC98\uB9AC \uC2E4\uC2B5",
        "\uC2EC\uD654: \uC624\uD508\uC18C\uC2A4 \uBA38\uC2E0\uBE44\uC804(OpenCV) \uBC0F \uC774\uC0C1 \uD0D0\uC9C0 \uBAA8\uB378 \uAD6C\uD604",
        "\uC2E4\uBB34 \uC801\uC6A9: \uAC00\uC0C1 PLC/\uC2DC\uBBAC\uB808\uC774\uD130\uB97C \uD65C\uC6A9\uD55C E2E \uD30C\uC774\uD504\uB77C\uC778 \uAC1C\uBC1C"
      ],
      recommendedProjectIdea: "\uAC00\uC0C1 \uBAA8\uBE4C\uB9AC\uD2F0 \uCC28\uCCB4 \uC0DD\uC0B0 \uB77C\uC778\uC744 \uAC00\uC815\uD55C \uC2E4\uC2DC\uAC04 \uC9C4\uB3D9 \uC13C\uC11C \uC774\uC0C1 \uD0D0\uC9C0 \uBC0F \uC6F9 \uAE30\uBC18 \uC6D0\uACA9 \uAD00\uC81C \uB300\uC2DC\uBCF4\uB4DC \uD504\uB85C\uC81D\uD2B8",
      isFallback: true
    });
  }
});
app.all("/api/*", (req, res) => {
  res.status(404).json({
    error: `\uC694\uCCAD\uD558\uC2E0 API \uACBD\uB85C\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4: ${req.method} ${req.originalUrl || req.url}`,
    status: 404
  });
});
app.use((err, _req, res, _next) => {
  console.error("[Express \uAE00\uB85C\uBC8C \uC5D0\uB7EC]", err?.message || err);
  const status = typeof err?.status === "number" && err.status >= 400 && err.status < 600 ? err.status : 500;
  const message = typeof err?.message === "string" ? err.message : "\uC11C\uBC84 \uB0B4\uBD80 \uCC98\uB9AC \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.";
  res.status(status).json({
    error: message,
    status
  });
});
async function setupViteOrStatic() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AutoInsight AI server running at http://0.0.0.0:${PORT} [mode: ${process.env.NODE_ENV || "development"}]`);
  });
}
var isDirectRun = !process.env.VERCEL && Boolean(
  process.argv[1] && (process.argv[1].endsWith("server.ts") || process.argv[1].endsWith("server.js") || process.argv[1].includes("tsx"))
);
if (isDirectRun) {
  setupViteOrStatic().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}
var server_default = app;
export {
  app,
  server_default as default
};

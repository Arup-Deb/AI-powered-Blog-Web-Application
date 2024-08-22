// import { NextRequest, NextResponse } from "next/server";
// import { Configuration, CreateChatCompletionResponse, OpenAIApi } from "openai";
// import { AxiosResponse } from "axios";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// export async function POST(request: NextRequest, response: NextResponse) {
//   try {
//     const { title, role } = await request.json();

//     const aiResponse: AxiosResponse<CreateChatCompletionResponse, any> =
//       await openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "user",
//             content: `Create small blog post with html tags based on this title: ${title}`,
//            //content: `Create 3 line blog post with html tags based on this title: ${title}`,
//           },
//           {
//             role: "system",
//             content: `${
//               role || "I am a helpful assistant"
//             }. Write with html tags.`,
//           },
//         ],
//         max_tokens: 3242,
//         top_p: 1,
//       });

//     // response.revalidate("/api/posts")
//     return NextResponse.json(
//       {
//         content: aiResponse.data.choices[0].message?.content,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("request error", error);
//     NextResponse.json({ error: "error updating post" }, { status: 500 });
//   }
// }

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = "process.env.OPENAI_API_KEY";

async function runChat() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 1,
    topK: 64,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
    ],
  });

  const result = await chat.sendMessage("YOUR_USER_INPUT");
  const response = result.response;
  console.log(response.text());
}

runChat();

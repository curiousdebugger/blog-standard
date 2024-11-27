import { OpenAIApi, Configuration } from "openai";

export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const topic = "dog ownership";
  const keywords = "first-time dog owner, puppy diet";

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO friendly blog post generator called BlogStandard. You are designed to output markdown without frontmatter.",
      },
      {
        role: "user",
        content: `
            Generate me a blog post on the following topic delimited by triple hypens:
            ---
            ${topic}
            --- 
            Targetting the following comma seperated keywords delimited by triple hyphens:
            ---
            ${keywords}
            ---
        `,
      },
    ],
  });

  const postContent = response.data.choices[0]?.message?.content;

  const seoResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO friendly blog post generator called BlogStandard. You are designed to output JSON, do not include HTML tags in your response.",
      },
      {
        role: "user",
        content: ` 
        Generate a SEO friendly title and SEO friendly meta description for the following blog post:
        ${postContent}
        ---
        The output JSON must be in the following format:
        {
          "title": "example title"
          "metadata_description": "example meta description"
        }
      `,
      },
    ],
    response_format: { type: "json_object" },
  });

  const { title, metaDescription } =
    seoResponse.data.choices[0]?.message?.content || {};
  res.status(200).json({ post: { postContent, title, metaDescription } });
}

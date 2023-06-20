const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  try {
    const response = await openai.createImage({
      prompt: `${req.query.poster_description}`,
      n: 1,
      size: "512x512"
    })


    res.status(200).json(response.data.data[0].url)

  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

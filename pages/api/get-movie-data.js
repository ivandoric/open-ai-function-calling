const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const schema = {
  type: "object",
  properties: {
    release_date: {
      type: "string",
      description: "Release date of the movie in Day.Month.Year format"
    },
    actors: {
      type: "array",
      description: "Get the names of first five most important actors in this movie",
      items: {
        type: "object",
        properties: {
          first_name: {type: "string"},
          last_name: {type: "string"}
        }
      }
    },
    director: {
      type: "string",
      description: "Director of the movie"
    },
    summary: {
      type: "string",
      description: "Provide a brief summary of the movie remove any double quotes from the text."
    },
    quotes: {
      type: "array",
      description: "Provide three most memorable lines from this movie",
      items: {
        type: "object",
        properties: {
          quote: {
            type: "string",
          },
          actor: {
            type: "string",
            description: "Actor that is saying the line."
          },
          person: {
            type: "string",
            description: "Character in the movie saying the line."
          }
        }
      }
    },
    poster_description: {
      type: "string",
      description: "Accurate description of the movie poster for this movie in seven sentences."
    }
  },
  required: ["release_date", "actors", "director", "summary", "quotes", "poster_description"]
}

export default async function handler(req, res) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: [
      {"role": "system", "content": "You are a movie database assistant."},
      {"role": "user", "content": `Give me information about movie called: ${req.query.movie_name}`}
    ],
    functions: [
      {name: "get_movie_data", "parameters": schema}
    ],
    function_call: {name: "get_movie_data"},
    temperature: 0,
  });

  res.status(200).json(response.data.choices[0].message.function_call.arguments)
}

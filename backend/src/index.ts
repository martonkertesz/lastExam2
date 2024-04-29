import express from "express";
import cors from "cors";
import { z } from "zod";

const app = express();
app.use(cors());
app.use(express.json());

const data = [
  { id: "1", name: "Titanic", genre: "drama", description: "lorem ipsum..." },
  {
    id: "2",
    name: "Star Wars",
    genre: "sci-fi",
    description: "lorem ipsum...",
  },
  {
    id: "3",
    name: "Lord of the rings",
    genre: "fantasy",
    description: "lorem ipsum...",
  },
  {
    id: "4",
    name: "Pulp fiction",
    genre: "comedy",
    description: "lorem ipsum...",
  },
  { id: "5", name: "Avatar", genre: "sci-fi", description: "lorem ipsum..." },
];

const sleep = (seconds: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), seconds * 1000));

const QuerySchema = z.object({
  genre: z.string(),
});

app.get("/api/movies", async (req, res) => {
  const validationResult = QuerySchema.safeParse(req.query);
  if (!validationResult.success) {
    console.log(JSON.stringify(validationResult.error.issues, null, 2));
    return res.sendStatus(400);
  }
  const query = validationResult.data;

  await sleep(2);
  if (Math.random() > 0.95) return res.sendStatus(500);
  await sleep(2);

  return res.json(
    data
      .filter((movie) => movie.genre === query.genre)
      .map(({ id, name }) => ({ id, name }))
  );
});

app.get("/api/movies/:id", async (req, res) => {
  const id = req.query.id;

  await sleep(2);
  if (Math.random() > 0.95) return res.sendStatus(500);
  await sleep(2);

  const movie = res.json(data.find((movie) => movie.id === id));
  if (!movie) return res.sendStatus(404);

  return res.json(movie);
});

app.listen(3000);

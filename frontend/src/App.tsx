import { useEffect, useState } from "react";

interface IMovie {
  id: string;
  name: string;
  genre: string;
  description: string;
}

interface IFetchParams {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  payload?: any;
}

function App() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  const getMoviesData = async (params: IFetchParams) => {
    const { url, method, payload } = params;

    try {
      setLoading(true);
      await fetch(url, {
        method: method,
        mode: "cors",
        cache: "no-cache",
        body: payload ? JSON.stringify(payload) : "",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          if (response.status === 500) {
            console.error("500 INTERNAL SERVER ERROR");
            return;
          }
          if (response.status === 400) {
            console.error("400 OOPS! BAD REQUEST HAPPENED");
            return;
          }
          if (response.status === 200) {
            const jsonData = await response.json();
            setMovies(jsonData);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      return console.error(err);
    }
  };

  useEffect(() => {
    getMoviesData({
      method: "GET",
      url: `localhost:3000/api/movies${
        filter !== "" ? `?genre=${filter}` : ""
      }`,
    });
  }, [filter]);

  return (
    <div>
      <section>
        <div
          onClick={() => {
            setFilter("sci-fi");
          }}
        >
          sci-fi
        </div>
        <div
          onClick={() => {
            setFilter("drama");
          }}
        >
          drama
        </div>
        <div
          onClick={() => {
            setFilter("fantasy");
          }}
        >
          fantasy
        </div>
        <div
          onClick={() => {
            setFilter("comedy");
          }}
        >
          comedy
        </div>
      </section>
      {loading === true ? (
        <div>Loading...</div>
      ) : (
        movies?.map((movie) => (
          <div key={movie.id} className="flex items-center gap-x-2">
            <p>{movie.id}</p>
            <p>{movie.name}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;

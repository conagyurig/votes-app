import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toTitleCase } from "./Navigation";

export interface Files {
  files: string[];
}

const Chapters: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  let [searchParams] = useSearchParams();
  let chapter = searchParams.get("chapter");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/list?folder=" + chapter);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: Files = await response.json();
        const files = processFiles(result);
        setData(files);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-center text-xl font-bold">
        {toTitleCase(
          chapter ? chapter.split("/")[0].replace("-", " ") : "Loading"
        )}
      </h1>
      <main className="flex items-center justify-center h-screen">
        {error ? <p>Error: {error}</p> : null}
        {data.length > 0 ? (
          <ul>
            <div className="w-full max-w-4xl">
              {data.map((item, index) => (
                <Link to={"/Note?note=" + item}>
                  <li
                    className="text-center text-decoration: underline mb-4"
                    key={index}
                  >
                    {item.split("/")[1].replace(/\.[^/.]+$/, "")}
                  </li>
                </Link>
              ))}
            </div>
          </ul>
        ) : (
          <p>Loading</p>
        )}
      </main>
    </div>
  );
};

export default Chapters;

export function processFiles(files: Files) {
  return files.files.filter((file) => !file.includes(".png"));
}

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { toTitleCase } from "./Navigation";
import ImageContainer from "./ui/imageCard";
import { Files, processFiles } from "./Chapters";
import { Separator } from "./ui/separator";
import { apiUrl } from "@/App";

const Note: React.FC = () => {
  const [content, setContent] = useState<JSX.Element>(<div></div>);
  const [chapters, setChapters] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  let [searchParams] = useSearchParams();
  let title = searchParams.get("note");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const file = await fetch(apiUrl + "/api/download?filename=" + title);
        if (!file.ok) {
          throw new Error("Network response was not ok");
        }
        const chapters = await fetch(
          apiUrl + "/api/list?folder=" + title?.split("/")[0]
        );
        if (!chapters.ok) {
          throw new Error("Network response was not ok");
        }
        const result: string = await file.text();
        const processedContent = processContent(result);
        setContent(processedContent);

        const files: Files = await chapters.json();
        const chapterTitles = processFiles(files);
        setChapters(chapterTitles);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      }
    };
    fetchData();
  }, [title]);

  return (
    <div>
      <h1 className="text-center text-xl font-bold m-6">
        {toTitleCase(
          title ? title.split("/")[1].replace(/\.[^/.]+$/, "") : "Loading"
        )}
      </h1>
      <div className="px-4 sm:px-10 md:px-20 lg:px-[15%] xl:px-[20%] text-base md:text-xl lg:text-xl xl:text-xl sm:text-base">
        {error ? <p>Error: {error}</p> : null}
        <div style={{ whiteSpace: "pre-line" }}>{content}</div>
      </div>
      <Separator className="my-4" />
      {chapters.length > 0 ? (
        <ul className="text-center my-10">
          <div className="">
            {chapters.map((item, index) => (
              <Link to={"/Note?note=" + item}>
                <li className="text-decoration: underline mb-4" key={index}>
                  {item.split("/")[1].replace(/\.[^/.]+$/, "")}
                </li>
              </Link>
            ))}
          </div>
        </ul>
      ) : (
        <p>No chapters found.</p>
      )}
    </div>
  );
};

export default Note;

function processContent(text: string) {
  const splitStrings = text.split(/!\[\[.*?\]\]/);
  const matches = [...text.matchAll(/!\[\[(.*?)\]\]/g)].map(
    (match) => match[1]
  );

  return (
    <div>
      {splitStrings.map((splitString, i) => (
        <p key={i}>
          <Latex>{splitString}</Latex>
          {i < matches.length && (
            <div className="flex flex-col items-center justify-center">
              <ImageContainer
                key={`image-${i}`}
                src={
                  "http://localhost:8000/api/download?filename=surfaces/" +
                  matches[i]
                }
              />
            </div>
          )}
        </p>
      ))}
    </div>
  );
}

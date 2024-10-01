import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { toTitleCase } from "./Navigation";

const Topics: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/folders");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: string[] = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-center text-xl font-bold mb-6">
        Welcome to the Topics Page
      </h1>
      <main className="flex items-center justify-center h-screen">
        <div className="w-full max-w-4xl">
          {error ? <p>Error: {error}</p> : null}
          {data.length > 0 ? (
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {data.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-2">
                      <Link to={"/Chapters?chapter=" + item}>
                        <Card className="p-4">
                          <img
                            src={`${item.split("/")[0]}.png`}
                            alt={item.split("/")[0]}
                            className="w-full object-cover mb-4 rounded-t-lg"
                          />
                          <CardContent className="flex flex-col items-center justify-center">
                            <CardTitle className="text-center">
                              {toTitleCase(
                                item.split("/")[0].replace("-", " ")
                              )}
                            </CardTitle>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <p>No topics found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Topics;

import { useState } from "react";
import { Card } from "./card";

const ImageContainer: React.FC<{ src: string }> = ({ src }) => {
  const [loading, setLoading] = useState(true);
  return (
    <Card className="p-4 max-w-md m-2">
      {loading && (
        <div className="m-2 w-96 h-96 rounded shadow-md animate-pulse bg-slate-700"></div>
      )}
      <img
        src={src}
        className={`w-full h-auto ${loading ? "hidden" : "block"}`}
        onLoad={() => setLoading(false)}
        onError={() => {}}
        alt="Image loading..."
      />
    </Card>
  );
};

export default ImageContainer;

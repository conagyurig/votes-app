import { Copy } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  roomURL: string;
}

const CopyURL: React.FC<Props> = ({ roomURL }) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(roomURL)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };
  return (
    <div className="pt-20">
      <button onClick={handleCopy}>
        <h3 className="flex text-lg ">
          Copy room link
          <Copy className="mx-2" />
        </h3>
        <div> </div>
      </button>
    </div>
  );
};

export default CopyURL;

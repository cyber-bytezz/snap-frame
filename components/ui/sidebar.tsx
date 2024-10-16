import { Button } from "@/components/ui/button";

type SidebarProps = {
  generations: {
    prompt: string;
    image: { b64_json: string };
  }[];
  setActiveIndex: (index: number) => void;
};

export default function Sidebar({ generations, setActiveIndex }: SidebarProps) {
  return (
    <aside className="h-full flex flex-col p-4 bg-gray-400 text-white">
      <h2 className="text-lg font-bold mb-4">Prompt History</h2>

      {/* Display list of past prompts and image thumbnails */}
      <ul className="flex-1 overflow-y-auto">
        {generations.length === 0 && <p>No prompts generated yet</p>}
        {generations.map((generation, index) => (
          <li key={index} className="mb-4 flex items-center h-12">
            <Button
              className="flex items-center w-full p-2 text-left bg-slate-700 hover:bg-gray-700 rounded-lg text-gray-300"
              onClick={() => setActiveIndex(index)} // On click, set active image
            >
              {/* Display Image Thumbnail */}
              <img
                src={`data:image/jpeg;base64,${generation.image.b64_json}`}
                alt="Generated Thumbnail"
                className="w-12 h-12 mr-3 rounded "
              />

              {/* Display Prompt (truncated if too long) */}
              <span className="flex-1">
                {generation.prompt.length > 30
                  ? generation.prompt.substring(0, 30) + "..."
                  : generation.prompt}
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

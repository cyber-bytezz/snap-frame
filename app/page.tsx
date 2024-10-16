"use client";

import GithubIcon from "@/components/icons/github-icon";
import Logo from "@/components/logo";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import imagePlaceholder from "@/public/image-placeholder.png";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { stat } from "fs";
import { useSession,signIn,signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ImageResponse = {
  b64_json: string;
  timings: { inference: number };
};

export default function Home() {
  const {data:session,status} = useSession();
  const [prompt, setPrompt] = useState("");
  const [iterativeMode, setIterativeMode] = useState(false);
  const [userAPIKey, setUserAPIKey] = useState("");
  const debouncedPrompt = useDebounce(prompt, 300);
  const [generations, setGenerations] = useState<{
    prompt: string;
    image: ImageResponse;
  }[]>([]);
  let [activeIndex, setActiveIndex] = useState<number>();

  const { data: image, isFetching } = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: [debouncedPrompt],
    queryFn: async () => {
      let res = await fetch("/api/generateImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, userAPIKey, iterativeMode }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      return (await res.json()) as ImageResponse;
    },
    enabled: !!debouncedPrompt.trim(),
    staleTime: Infinity,
    retry: false,
  });

  let isDebouncing = prompt !== debouncedPrompt;

  useEffect(() => {
    if (image && !generations.map((g) => g.image).includes(image)) {
      setGenerations((images) => [...images, { prompt, image }]);
      setActiveIndex(generations.length);
    }
  }, [generations, image, prompt]);

  let activeImage =
    activeIndex !== undefined ? generations[activeIndex].image : undefined;

  // Array of image paths from the public folder
  const imagesFromPublic = [
    "/1.png",
    "/2.png",
    "/3.png",
    "/4.png",
    "/5.png",
    "/6.png",
    "/7.png",
    "/8.png",
    "/1.png",
    "/2.png",
    "/3.png",
    "/4.png",
    // Add more image paths as needed
  ];

  return (
    <div className="flex h-full flex-col px-5">
      <header className="flex flex-col-reverse lg:flex-row lg:gap-12 py-4 gap-4">
      <div className="md:w-2/3">
      <div className=" w-full md:max-w-80">
          <label className="text-xs text-gray-200">
            [Optional] Add your{" "}
            <a
              href="https://api.together.xyz/settings/api-keys"
              target="_blank"
              className="underline underline-offset-4 transition hover:text-blue-500"
            >
              Together API Key
            </a>
          </label>
          <Input
            placeholder="API Key"
            type="password"
            value={userAPIKey}
            className="mt-1 bg-gray-400 text-gray-200 placeholder:text-gray-300"
            onChange={(e) => setUserAPIKey(e.target.value)}
          />
        </div>
        </div>
        <div className="flex items-start justify-between lg:w-full pt-2">
          <div className="">
          <a href="https://www.dub.sh/together-ai" target="_blank">
            <Logo
              iconSrc="https://github.com/shadcn.png"
              brandName="SnapFrame"
            />
          </a>
          </div>
          <div className="">
            {
              status === "authenticated" ? (
                <Button
                size="lg"
                variant="outline"
                className="inline-flex items-center gap-2"
                onClick={() => signOut()}
              >Sign out</Button>
              ) : (
                <Button
                size="lg"
                variant="outline"
                className="inline-flex items-center gap-2"
                onClick={() => signIn("google")}
              >Sign In</Button>
              )
            }
          </div>
        </div>
        
      </header>

      {/* Content Area */}
      <div className="flex justify-center">
        <form className="mt-10 w-full max-w-lg">
          <fieldset>
            <div className="relative">
              <Textarea
                rows={4}
                spellCheck={false}
                placeholder={status === "authenticated" ? `Describe your image...` : `Sign in to generate images...`}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full resize-none border-gray-300 border-opacity-50 bg-gray-400 px-4 text-base placeholder-gray-300"
               disabled={status !== "authenticated"}
              />
            
              <div
                className={`${isFetching || isDebouncing ? "flex" : "hidden"
                  } absolute bottom-3 right-3 items-center justify-center`}
              >
                <Spinner className="size-4" />
              </div>
            </div>

            <div className="mt-3 text-sm md:text-right">
              <label
                title="Use earlier images as references"
                className="inline-flex items-center gap-2"
              >
                Consistency mode
                <Switch
                  checked={iterativeMode}
                  onCheckedChange={setIterativeMode}
                />
              </label>
            </div>
          </fieldset>
        </form>
      </div>

      {/* Active Image or Prompt Section */}
      <div className="flex w-full grow flex-col items-center justify-center pb-8 pt-4 text-center">
        {/* Conditional Rendering of Active Image */}
        {!activeImage || !prompt ? (
          <div className="max-w-xl md:max-w-4xl lg:max-w-3xl">
            <p className="text-xl font-semibold text-gray-200 md:text-3xl lg:text-4xl">
              Generate images in real-time
            </p>
            <p className="mt-4 text-balance text-sm text-gray-300 md:text-base lg:text-lg">
              Enter a prompt and generate images in milliseconds as you type.
              Powered by Flux on Together AI.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex w-full max-w-4xl flex-col justify-center">
            {/* Active Image Display */}
            <div>
              <Image
                placeholder="blur"
                blurDataURL={imagePlaceholder.blurDataURL}
                width={1024}
                height={768}
                src={`data:image/png;base64,${activeImage.b64_json}`}
                alt=""
                className={`${isFetching ? "animate-pulse" : ""
                  } max-w-full rounded-lg object-cover shadow-sm shadow-black`}
              />
            </div>

            {/* Generations Gallery */}
            <div className="mt-4 flex gap-4 overflow-x-scroll pb-4">
              {generations.map((generatedImage, i) => (
                <button
                  key={i}
                  className="w-32 shrink-0 opacity-50 hover:opacity-100"
                  onClick={() => setActiveIndex(i)}
                >
                  <Image
                    placeholder="blur"
                    blurDataURL={imagePlaceholder.blurDataURL}
                    width={1024}
                    height={768}
                    src={`data:image/png;base64,${generatedImage.image.b64_json}`}
                    alt=""
                    className="max-w-full rounded-lg object-cover shadow-sm shadow-black"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Automatically Scroll Horizontal Gallery Below */}
      <div className="overflow-hidden">
        <div className="flex gap-4 animate-scroll whitespace-nowrap">
          {imagesFromPublic.map((imageSrc, index) => (
            <div key={index} className="flex-shrink-0 w-32 md:w-48 lg:w-64">
              <Image
                src={imageSrc}
                alt={`Gallery Image ${index + 1}`}
                width={400}  // Set width for the images
                height={300} // Set height for the images
                className="max-w-full rounded-lg object-cover shadow-sm shadow-black"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-16 w-full items-center pb-10 text-center text-gray-300 md:mt-4 md:flex md:justify-between md:pb-5 md:text-xs lg:text-sm">
        <p>
          Powered by{" "}
          <a
            href="https://hyper-flux.vercel.app"
            target="_blank"
            className="underline underline-offset-4 transition hover:text-blue-500"
          >
            HyperFlux.ai
          </a>{" "}
        </p>

        <div className="mt-8 flex items-center justify-center md:mt-0 md:justify-between md:gap-6">


          <div className="flex gap-6 md:gap-2">
            <a href="https://github.com/cyber-bytezz" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-2"
              >
                <GithubIcon className="size-4" />
                GitHub
              </Button>
            </a>
            <a href="https://www.linkedin.com/in/-aro-barath-chandru--12725622a/?originalSubdomain=in" target="_blank">
              <Button
                size="sm"
                variant="outline"
                className="inline-flex items-center gap-2"
              >
                <LinkedInLogoIcon className="size-3" />
                LinkedIn
              </Button>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

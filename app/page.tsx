"use client";

import GithubIcon from "@/components/icons/github-icon";
import Logo from "@/components/logo";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import imagePlaceholder from "@/public/image-placeholder.png";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useSession, signIn, signOut } from "next-auth/react"; 
import Image from "next/image";
import { useEffect, useState } from "react";

type ImageResponse = {
  b64_json: string;
  timings: { inference: number };
};

export default function Home() {
  const { data: session, status } = useSession();
  const [prompt, setPrompt] = useState("");
  const [iterativeMode, setIterativeMode] = useState(false);
  const debouncedPrompt = useDebounce(prompt, 300);
  const [generations, setGenerations] = useState<{
    prompt: string;
    image: ImageResponse;
  }[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>();

  const { data: image, isFetching } = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: [debouncedPrompt],
    queryFn: async () => {
      let res = await fetch("/api/generateImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, iterativeMode }),
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

  const isDebouncing = prompt !== debouncedPrompt;

  useEffect(() => {
    if (image && !generations.map((g) => g.image).includes(image)) {
      setGenerations((images) => [...images, { prompt, image }]);
      setActiveIndex(generations.length);
    }
  }, [generations, image, prompt]);

  const activeImage =
    activeIndex !== undefined ? generations[activeIndex].image : undefined;

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
  ];

  return (
    <div className="h-full w-full flex flex-row ">
      <div className="w-64 h-full md:w-48 lg:w-64">
        <Sidebar
          generations={generations}
          setActiveIndex={setActiveIndex}
        />
      </div>
      <div className="flex-1 flex flex-col px-5 overflow-auto">
        <header className="flex justify-center pt-20 md:justify-end md:pt-3">
          <div className="absolute left-1/2 top-6 -translate-x-1/2">
            <a href="https://www.dub.sh/together-ai" target="_blank">
              <Logo iconSrc="https://github.com/shadcn.png" brandName="SnapFrame" />
            </a>
          </div>

          <div>
            {status === "loading" ? (
              <p>Loading...</p>
            ) : session ? (
              <div className="flex gap-4">
                <p className="text-gray-200">Welcome, {session.user?.name}!</p>
                <Button onClick={() => signOut()}>Sign Out</Button>
              </div>
            ) : (
              <Button onClick={() => signIn("google")}>Sign In with Google</Button>
            )}
          </div>
        </header>

        <div className="flex-1 flex justify-center">
          <form className="mt-10 w-full max-w-lg">
            <fieldset>
              <div className="relative">
                <Textarea
                  rows={4}
                  spellCheck={false}
                  placeholder={
                    status === "authenticated"
                      ? "Describe your image..."
                      : "Sign in to generate images..."
                  }
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

        <div className="flex w-full grow flex-col items-center justify-center pb-8 pt-4 text-center">
          {!activeImage || !prompt ? (
            <div className="max-w-xl md:max-w-4xl lg:max-w-3xl">
              <p className="text-xl font-semibold text-gray-200 md:text-3xl lg:text-4xl">
                Generate Stunning Images Instantly!
              </p>
              <p className="mt-4 text-balance text-sm text-gray-300 md:text-base lg:text-lg">
                Enter a prompt and generate images in milliseconds as you type.
              </p>
            </div>
          ) : (
            <div className="mt-4 flex w-full max-w-4xl flex-col justify-center">
              <div>
                <Image
                  placeholder="blur"
                  blurDataURL={imagePlaceholder.blurDataURL}
                  width={1024}
                  height={768}
                  src={`data:image/png;base64,${activeImage.b64_json}`}
                  alt=""
                  className={`${
                    isFetching ? "animate-pulse" : ""
                  } max-w-full rounded-lg object-cover shadow-sm shadow-black`}
                />
              </div>

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

        <div className="overflow-hidden">
          <div className="flex gap-4 animate-scroll whitespace-nowrap">
            {imagesFromPublic.map((imageSrc, index) => (
              <div key={index} className="flex-shrink-0 w-32 md:w-48 lg:w-64">
                <Image
                  src={imageSrc}
                  alt={`Gallery Image ${index + 1}`}
                  width={400}
                  height={300}
                  className="max-w-full rounded-lg object-cover shadow-sm shadow-black"
                />
              </div>
            ))}
          </div>
        </div>

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
              <a
                href="https://www.linkedin.com/in/-aro-barath-chandru--12725622a/?originalSubdomain=in"
                target="_blank"
              >
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
    </div>
  );
}

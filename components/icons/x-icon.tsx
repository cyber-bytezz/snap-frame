import { ComponentProps } from "react";

export default function LinkedInIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      width={24} // Adjust the size as needed
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22.23 0H1.77C0.792 0 0 0.774 0 1.727v20.545C0 23.227 0.793 24 1.77 24h20.46C23.208 24 24 23.226 24 22.273V1.727C24 0.774 23.207 0 22.23 0ZM7.12 20.452H3.577V9H7.12v11.452ZM5.35 7.597a2.064 2.064 0 1 1 0-4.129 2.064 2.064 0 0 1 0 4.129ZM20.452 20.452h-3.542v-5.928c0-1.412-.028-3.228-1.966-3.228-1.967 0-2.268 1.538-2.268 3.126v6.03H9.134V9h3.396v1.562h.05c.472-.89 1.626-1.828 3.345-1.828 3.576 0 4.236 2.355 4.236 5.419v6.299Z"
        fill="currentColor"
      />
    </svg>
  );
}

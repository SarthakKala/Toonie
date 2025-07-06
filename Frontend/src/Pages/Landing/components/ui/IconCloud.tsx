import { IconCloud } from "@/Pages/Landing/components/magicui/icon-cloud";
 
const slugs = [
  "typescript",
  "javascript",
  "threedotjs",
  "supabase",
  "react",
  "redis",
  "tailwindcss",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "digitalocean",
  "vercel",
  "selenium",
  "openai",
  "p5dotjs",
  "docker",
  "git",
  "claude",
  "githubcopilot",
  "gitlab",
  "visualstudiocode",
  "gitignoredotio",
  "nestjs",
  "figma",
];
 
export function IconCloudDemo() {
  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
  );
 
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <IconCloud images={images} />
    </div>
  );
}

export default IconCloudDemo;
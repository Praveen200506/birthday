import { Metadata } from "next";
import BlogAuthWrapper from "@/components/blog/BlogAuthWrapper";
import BlogFeed from "@/components/blog/BlogFeed";

export const metadata: Metadata = {
  title: "Our Journal & Stories 📖 | Birthday Celebration",
  description: "A personal collection of thoughts, stories, and warm memories.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-warm-cream/40 pt-16 pb-28">
      <BlogAuthWrapper>
        <BlogFeed />
      </BlogAuthWrapper>
    </main>
  );
}

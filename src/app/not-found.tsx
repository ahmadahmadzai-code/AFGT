import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
      <Container>
        <div className="flex min-h-screen flex-col items-start justify-center py-20">
          <Eyebrow>404 · Not found</Eyebrow>
          <h1 className="mt-6 font-display text-display-lg">
            <span className="glow-text">This page got lost</span>{" "}
            <span className="gradient-text">in deployment.</span>
          </h1>
          <p className="mt-5 max-w-lg text-ink-200/85">
            The page you're looking for doesn't exist — or maybe it never did.
            Either way, here's a way home.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/">
              <Button size="lg" variant="primary">Back home</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">Contact us</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

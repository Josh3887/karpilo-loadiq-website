"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clapperboard, VideoOff } from "lucide-react";

import { BRAND } from "@/config/brand";
import { MEDIA, type VideoMedia } from "@/config/media";

type DemoVideoPlayerProps = {
  media?: VideoMedia;
};

export function DemoVideoPlayer({ media = MEDIA.demoWalkthrough }: DemoVideoPlayerProps) {
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-10 sm:px-8">
      <div className="grid gap-6 rounded-[1.75rem] border border-white/10 bg-[#0B1120]/85 p-5 shadow-[0_0_70px_rgba(56,189,248,0.1)] lg:grid-cols-[0.92fr_1.08fr] lg:p-6">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-sky-200">
              <Clapperboard className="h-3.5 w-3.5" aria-hidden="true" />
              {media.title}
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
              See the workflow before you try it.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              {media.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#interactive-demo"
              className="inline-flex items-center gap-2 rounded-full bg-sky-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-white"
            >
              Try Interactive Demo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2">
              <Image
                src={BRAND.appIcon}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-lg object-cover"
              />
              <span className="text-xs font-bold text-slate-300">
                Pilot onboarding preview
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.25rem] border border-sky-300/20 bg-black shadow-2xl shadow-sky-950/40">
          <div className="relative aspect-video">
            {videoUnavailable ? (
              <div className="absolute inset-0">
                <Image
                  src={media.poster}
                  alt={`${BRAND.productName} demo video poster`}
                  fill
                  sizes="(min-width: 1024px) 54vw, 100vw"
                  className="object-cover opacity-45"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/68 p-6 text-center">
                  <VideoOff className="h-9 w-9 text-sky-200" aria-hidden="true" />
                  <p className="mt-4 max-w-md text-sm font-bold leading-6 text-white">
                    Demo video file is ready to connect. Add the MP4 at{" "}
                    <span className="font-mono text-sky-200">{media.src}</span>.
                  </p>
                </div>
              </div>
            ) : (
              <video
                className="h-full w-full bg-black object-cover"
                controls
                muted
                playsInline
                preload="metadata"
                poster={media.poster}
                onError={() => setVideoUnavailable(true)}
              >
                <source src={media.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <p className="border-t border-white/10 bg-slate-950 px-4 py-3 text-xs leading-5 text-slate-400">
            {media.caption}
          </p>
        </div>
      </div>
    </section>
  );
}

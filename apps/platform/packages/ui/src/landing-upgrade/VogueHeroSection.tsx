"use client";

import { cn } from "@leadswap/utils";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface VogueHeroSectionProps {
    className?: string;
}

// Cutouts configuration with positions matching the original Vogue layout
const FLOATING_CUTOUTS = [
    { src: "/vogue-hero/asset 0.png", className: "left-[2%] top-[8%] w-[120px]", delay: 0 },
    { src: "/vogue-hero/asset 1.png", className: "right-[3%] top-[12%] w-[100px]", delay: 0.2 },
    { src: "/vogue-hero/asset 2.png", className: "left-[8%] top-[25%] w-[140px]", delay: 0.1 },
    { src: "/vogue-hero/asset 3.png", className: "right-[5%] top-[28%] w-[130px]", delay: 0.3 },
    { src: "/vogue-hero/asset 4.png", className: "left-[3%] top-[45%] w-[110px]", delay: 0.15 },
    { src: "/vogue-hero/asset 5.png", className: "right-[2%] top-[50%] w-[120px]", delay: 0.25 },
    { src: "/vogue-hero/asset 6.png", className: "left-[6%] bottom-[30%] w-[100px]", delay: 0.35 },
    { src: "/vogue-hero/asset 10.png", className: "right-[8%] bottom-[25%] w-[150px]", delay: 0.4 },
    { src: "/vogue-hero/asset 11.png", className: "left-[12%] bottom-[12%] w-[130px]", delay: 0.5 },
    { src: "/vogue-hero/asset 12.png", className: "right-[12%] bottom-[8%] w-[90px]", delay: 0.45 },
];

/**
 * VogueHeroSection - Hero section fidèle au style Vogue original
 * Collage de cutouts flottants avec animations GSAP bobbing
 */
export function VogueHeroSection({ className }: VogueHeroSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const cutoutsRef = useRef<(HTMLImageElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Timeline d'entrée
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Animation du badge
            tl.fromTo(
                badgeRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 }
            );

            // Animation du titre ligne par ligne
            const titleLines = titleRef.current?.querySelectorAll(".title-line");
            if (titleLines) {
                tl.fromTo(
                    titleLines,
                    { opacity: 0, y: 60, rotateX: -20 },
                    {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        duration: 0.8,
                        stagger: 0.15
                    },
                    "-=0.3"
                );
            }

            // Animation du sous-titre
            tl.fromTo(
                subtitleRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 },
                "-=0.4"
            );

            // Animations d'entrée des cutouts avec stagger
            cutoutsRef.current.forEach((cutout, index) => {
                if (!cutout) return;

                // Entrée fade + scale
                tl.fromTo(
                    cutout,
                    { opacity: 0, scale: 0.8, y: 40 },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "back.out(1.4)"
                    },
                    `-=${0.5 - index * 0.05}`
                );

                // Animation bobbing continue (après entrée)
                gsap.to(cutout, {
                    y: "random(-15, 15)",
                    x: "random(-8, 8)",
                    rotation: "random(-5, 5)",
                    duration: "random(3, 5)",
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    delay: FLOATING_CUTOUTS[index]?.delay || 0
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className={cn(
                "relative min-h-[200vh] overflow-hidden bg-[#f9f8f3]",
                className
            )}
        >
            {/* Radial glow effect - purple/pink center */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 50% at 50% 40%, 
                            rgba(169, 95, 254, 0.15) 0%, 
                            rgba(228, 206, 255, 0.1) 30%,
                            transparent 70%
                        )
                    `
                }}
            />

            {/* Navigation badge */}
            <div
                ref={badgeRef}
                className="absolute left-1/2 top-8 z-20 -translate-x-1/2 opacity-0"
            >
                <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-sm backdrop-blur-sm">
                    <span className="text-neutral-500">Gen Z broke the marketing funnel</span>
                </div>
            </div>

            {/* Floating cutouts - positioned around the hero */}
            <div className="pointer-events-none absolute inset-0 z-10">
                {FLOATING_CUTOUTS.map((cutout, index) => (
                    <img
                        key={index}
                        ref={(el) => { cutoutsRef.current[index] = el; }}
                        src={cutout.src}
                        alt=""
                        className={cn(
                            "absolute opacity-0 object-contain drop-shadow-lg",
                            "transition-transform duration-300 hover:scale-110",
                            cutout.className
                        )}
                        loading="eager"
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-32">
                <h1
                    ref={titleRef}
                    className="text-center font-display text-6xl font-bold leading-[0.85] tracking-tighter text-[#161414] sm:text-7xl md:text-8xl lg:text-[11rem]"
                    style={{ perspective: "1000px" }}
                >
                    <span className="title-line block uppercase">Gen Z broke</span>
                    <span className="title-line block lowercase">the marketing</span>
                    <span className="title-line block lowercase">funnel</span>
                </h1>

                <div
                    ref={subtitleRef}
                    className="mt-16 flex flex-col items-center gap-4 opacity-0"
                >
                    {/* Part II badge */}
                    <div className="inline-flex items-center gap-2">
                        <span
                            className="rounded-sm bg-[#76ff02] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#161414]"
                        >
                            (part II)
                        </span>
                    </div>

                    {/* "What now?" in italic Didot style */}
                    <h2
                        className="mt-4 font-serif text-5xl italic text-[#161414] sm:text-6xl md:text-7xl"
                        style={{ fontFamily: "'Didot', 'Playfair Display', Georgia, serif" }}
                    >
                        What now?
                    </h2>

                    <p className="mt-8 max-w-xl text-center text-lg leading-relaxed text-neutral-600">
                        Shopping via social media has made the traditional
                        marketing funnel obsolete. Here's what brands need to know.
                    </p>

                    {/* Scroll indicator */}
                    <div className="mt-20 flex flex-col items-center gap-2">
                        <span className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                            Scroll to explore
                        </span>
                        <div className="h-16 w-px bg-gradient-to-b from-neutral-300 to-transparent" />
                    </div>
                </div>
            </div>

            {/* Second "viewport" content - as the hero is 200vh */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-32">
                <div className="max-w-4xl text-center">
                    <p className="font-serif text-2xl leading-relaxed text-[#161414] md:text-3xl">
                        The funnel was a convenient fiction. In reality,
                        <span className="mx-2 inline-block rounded-sm bg-[#4d9eff] px-2 py-1 text-white">
                            Gen Z
                        </span>
                        doesn't follow a linear path to purchase.
                    </p>
                </div>
            </div>

            {/* Decorative accents */}
            <div className="pointer-events-none absolute inset-0 z-0">
                {/* Top left lime accent */}
                <div className="absolute left-[5%] top-[15%] h-40 w-40 rounded-full bg-[#76ff02]/15 blur-[80px]" />
                {/* Right blue accent */}
                <div className="absolute right-[10%] top-[40%] h-48 w-48 rounded-full bg-[#4d9eff]/15 blur-[80px]" />
                {/* Bottom purple accent */}
                <div className="absolute bottom-[20%] left-[20%] h-56 w-56 rounded-full bg-[#a95ffe]/10 blur-[100px]" />
            </div>
        </section>
    );
}

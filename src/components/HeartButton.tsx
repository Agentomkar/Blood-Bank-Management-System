import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { loadFull } from "tsparticles";

import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { ParticlesProvider, useParticlesProvider } from "@tsparticles/react";
import { cn } from "@/lib/utils";

const options: ISourceOptions = {
  key: "heart",
  name: "Heart",
  particles: {
    number: {
      value: 20,
      density: {
        enable: false,
      },
    },
    color: {
      value: ["#DC143C", "#8B0000", "#ff1a4a", "#f5a3a3", "#a81414", "#ff6b6b", "#cc1f1f"],
    },
    shape: {
      type: "star",
      options: {
        star: {
          sides: 4,
        },
      },
    },
    opacity: {
      value: 0.8,
    },
    size: {
      value: { min: 1, max: 4 },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      enable: true,
      direction: "clockwise",
      animation: {
        enable: true,
        speed: 10,
        sync: false,
      },
    },
    links: {
      enable: false,
    },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: {
        x: 120,
        y: 45,
      },
    },
  },
  interactivity: {
    events: {},
  },
  smooth: true,
  fpsLimit: 120,
  background: {
    color: "transparent",
    size: "cover",
  },
  fullScreen: {
    enable: false,
  },
  detectRetina: true,
  absorbers: [
    {
      enable: true,
      opacity: 0,
      size: {
        value: 1,
        density: 1,
        limit: {
          radius: 5,
          mass: 5,
        },
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: {
        wait: true,
      },
      rate: {
        quantity: 5,
        delay: 0.5,
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
};

const HeartButtonContent = () => {
  const { loaded } = useParticlesProvider();
  const [particleState, setParticlesReady] = useState<"loaded" | "ready">();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (loaded) {
      setParticlesReady("loaded");
    }
  }, [loaded]);

  const modifiedOptions = useMemo(() => {
    options.autoPlay = isHovering;
    return options;
  }, [isHovering]);

  return (
    <button
      className="group relative my-8 rounded-full bg-gradient-to-r from-crimson-400/30 via-crimson-500/30 via-40% to-crimson-600/30 p-1 text-white transition-transform hover:scale-110 active:scale-105"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative flex items-center justify-center rounded-full bg-gradient-to-r from-crimson-500 via-crimson-600 to-crimson-700 p-3 text-white">
        <Heart 
          className="size-6 fill-white text-white animate-heartbeat" 
          strokeWidth={1.5}
        />
        <Heart
          style={{
            animationDelay: "1s",
          }}
          className="absolute bottom-2.5 left-3.5 z-20 size-2 rotate-12 fill-white text-white animate-heartbeat"
          strokeWidth={1.5}
        />
        <Heart
          style={{
            animationDelay: "1.5s",
            animationDuration: "2.5s",
          }}
          className="absolute left-5 top-2.5 size-1 -rotate-12 fill-white text-white animate-heartbeat"
          strokeWidth={1.5}
        />
        <Heart
          style={{
            animationDelay: "0.5s",
            animationDuration: "2.5s",
          }}
          className="absolute left-3 top-3 size-1.5 fill-white text-white animate-heartbeat"
          strokeWidth={1.5}
        />
      </div>
      {loaded && !!particleState && (
        <Particles
          id="heart-particles"
          className={cn("pointer-events-none absolute -bottom-4 -left-4 -right-4 -top-4 z-0 opacity-0 transition-opacity", {
            "group-hover:opacity-100": particleState === "ready",
          })}
          particlesLoaded={async () => {
            setParticlesReady("ready");
          }}
          options={modifiedOptions}
        />
      )}
    </button>
  );
};

export const Component = () => {
  return (
    <ParticlesProvider init={async (engine) => { await loadFull(engine); }}>
      <HeartButtonContent />
    </ParticlesProvider>
  );
};

export const HeartButton = Component;
export default Component;

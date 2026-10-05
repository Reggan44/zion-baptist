"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

/**
 * Premium NotFound Page
 * Featuring an animated background and clean typography for a smooth user experience.
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="bg-white font-sans min-h-screen flex items-center justify-center p-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center space-y-8">
            {/* Animated 404 Background Area */}
            <div
              className="relative h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain flex items-center justify-center overflow-hidden rounded-[3rem]"
              style={{ backgroundImage: "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)" }}
              aria-label="Man looking around lost"
            >
              <div className="absolute inset-0 bg-brand-grey/5 md:hidden" />
              <h1 className="relative z-10 text-center text-brand-grey text-6xl sm:text-9xl font-black drop-shadow-2xl md:opacity-10">
                404
              </h1>
              <div className="absolute bottom-4 left-0 right-0 md:hidden">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-grey/40">Lost in the Valley</span>
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black text-brand-grey tracking-tight">
                Looks like you're <span className="text-brand-sage italic">lost</span>.
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                The page you are looking for has been moved or doesn't exist in our current map.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Button
                  size="lg"
                  variant="default"
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto px-8 py-6 rounded-full bg-brand-grey text-white font-bold gap-2 group"
                >
                  <Home className="size-5 group-hover:-translate-y-0.5 transition-transform" />
                  Go to Home
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-8 py-6 rounded-full border-brand-grey/20 text-brand-grey font-bold gap-2 group"
                >
                  <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

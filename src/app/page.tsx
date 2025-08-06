import { FormVerseClient } from "@/components/form-verse/form-verse-client";
import { Dumbbell } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tighter sm:text-2xl xl:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            FormVerse
          </h1>
        </div>
      </header>
      <main className="flex-1">
        <FormVerseClient />
      </main>
    </div>
  );
}

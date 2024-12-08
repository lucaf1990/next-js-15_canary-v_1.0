import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-h-screen mt-40 flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-lg">
        <h2 className="text-orange-800 text-4xl font-bold">Not Found</h2>
        <p className="text-slate-600 text-lg">
          Could not find the requested resource. 
        </p>
        <p className="text-slate-600 text-lg">The page you are looking for might have been removed or is temporarily unavailable.</p>
        <Button className="bg-primary-800"><Link 
          href="/" 
         className="text-white"
        >
          Return Home
        </Link></Button>
        
      </div>
    </main>
  );
}
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Github } from "lucide-react";
import Image from "next/image";
import { signIn } from "@/auth";

export function LoginDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
        >
          Sign-In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="bg-white">
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center">
              <Image
                src="/chefRobot.png"
                alt="TeachChef Logo"
                width={150}
                height={50}
                className="rounded-lg"
              />
            </div>
            <span className="text-2xl font-bold text-primary-600">
              Welcome to TeachChef
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 py-6 bg-white">
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <Button
              className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 h-11"
              type="submit"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </Button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button
              variant="outline"
              className="w-full border-slate-400 hover:bg-slate-200 gap-2 h-11"
              type="submit"
            >
              <Image src="/google.png" alt="Google" width={18} height={18} />
              Continue with Google
            </Button>
          </form>
        </div>

        <div className="flex justify-center">
          <span className="w-2/3 border-t border-slate-200" />
        </div>

        <p className="text-center text-sm text-slate-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </DialogContent>
    </Dialog>
  );
}

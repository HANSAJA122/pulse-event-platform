import { signIn } from "@/auth";
import { Link } from "@/i18n/routing";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 relative overflow-hidden">
      
      {/* Background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/[0.03] blur-[100px] rounded-full pointer-events-none" />
      
      <Link href="/" className="absolute top-8 left-8 text-pulse-text-muted hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
        &larr; Back to home
      </Link>

      <div className="w-full max-w-sm glass-panel p-8 rounded-3xl relative z-10">
        <h1 className="text-2xl font-bold mb-2 font-display tracking-tight text-center">Log in to Pulse</h1>
        <p className="text-pulse-text-muted text-sm text-center mb-8">Manage your events and check-ins.</p>
        
        <div className="flex flex-col gap-4">
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/dashboard" })
            }}
          >
            <button className="w-full py-2.5 px-4 flex items-center justify-center gap-3 rounded-xl glass-panel-interactive font-medium text-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </form>
          
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0A0A0A] px-2 text-pulse-text-muted">Or</span>
            </div>
          </div>

          <form
            action={async (formData) => {
              "use server"
              await signIn("resend", formData)
            }}
            className="flex flex-col gap-3"
          >
            <input 
              type="email" 
              name="email" 
              placeholder="name@example.com"
              required
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-sm placeholder:text-white/30"
            />
            <button className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors">
              Send Magic Link
            </button>
          </form>

          <p className="text-center text-sm text-pulse-text-muted mt-6">
            Don't have an account? <Link href="/register" className="text-white hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

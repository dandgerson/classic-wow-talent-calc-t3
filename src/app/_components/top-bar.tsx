import Link from "next/link";
import { auth } from "~/server/auth";

export async function TopBar() {
  const session = await auth();

  /**
   * TODO: make a actual navlinks
   */
  // const renderNavLink = () => (
  //   <a
  //     href="#"
  //     className="inline-flex items-center px-1 pt-1 font-medium hover:text-blue-600"
  //   >
  //     Product
  //   </a>
  // );

  return (
    <nav className="fixed top-0 left-0 z-50 w-full text-xl text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Navigation links */}
          <div className="flex space-x-8">Classic WOW Talent Calculator</div>

          {/* Right side - CTA button */}
          <div className="ml-4 flex items-center gap-2">
            <p className="text-center text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-2 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

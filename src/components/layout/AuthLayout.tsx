import { Outlet } from "react-router-dom";

const AuthFooter = () => (
  <p className="mt-6 text-center text-xs text-gray-400">
    &copy; {new Date().getFullYear()} Upturn Business Solutions. All rights
    reserved.
  </p>
);

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-sidebar-bg pt-[12vh]">
      <div className="w-full max-w-[420px]">
        <Outlet />
        <AuthFooter />
      </div>
    </div>
  );
}

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-gray-100">
        
        {/* NAVBAR */}
        <div className="bg-blue-500 text-white flex justify-between items-center px-6 py-3">
          
          {/* LEFT */}
          <h2 className="text-xl font-bold">My App</h2>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            
            {/* USERNAME */}
            <span className="font-semibold">
              { localStorage.getItem("displayName")}
            </span>

            {/* LOGOUT */}
            <button
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
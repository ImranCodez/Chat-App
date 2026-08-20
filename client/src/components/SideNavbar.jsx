import React from "react";
import { Link } from "react-router-dom";
import ConversationItems from "./ui/ConversationItems";
import { useGetConversationQuery } from "../lib/api";
const SideNavbar = ({ profile }) => {
  const {data,isFetching}=useGetConversationQuery()

console.log("converstion", data?.data)
  return (
    <div className="bg-blue-600 h-screen relative w-65 pl-4 flex flex-col">
      <div>
        <h1 className="text-3xl pl-5 pt-3 font-bold text-white">
          <Link to="/">ChatApp</Link>
        </h1>
        <div className="mt-3 space-y-3">
          {
         data?.data.map((items)=>(
          <ConversationItems key={items._id} profile={items} myid={profile._id} />
         ))
          }
        </div>
      </div>
      {/* .....under the div written flex */}
      <div className="absolute bottom-4">
        <div className=" mt-12 mr-3 mb-3 flex text-center justify-between gap-2.5  rounded-2xl ">
        <Link
          className="py-2 px-7 text-slate-950 rounded-full bg-amber-50 hover:bg-slate-700 hover:text-white transition-al duration-300"
          to="/login"
        >
          Login
        </Link>
        <Link
          className="py-2 px-7 text-slate-950 rounded-full bg-amber-50 hover:bg-slate-700 hover:text-white transition-al duration-300"
          to="/signup"
        >
          signup
        </Link>
      </div>
        <div>
          <div className="group flex items-center gap-2 mb-2 border-b border-t border-white rounded-[7px] duration-200 hover:bg-gray-300">
            <div className="border mb-5 mt-2 ml-2 w-10 h-10 border-slate-800 rounded-full flex items-center justify-center bg-slate-600 text-white">
              I
            </div>

            <div>
              <h1 className="text-[17px] font-semibold text-black">
               {profile?.data?.fullname}
              </h1>
            </div>
          </div>
        </div>
      <div className=" bg-slate-900 mr-3 text-white py-2 px-12 text-center rounded-2xl transition-all duration-[400ms] hover:bg-white hover:text-black hover:font-semibold">
        <p>Log Out</p>
      </div>
      </div>
    </div>
  );
};

export default SideNavbar;

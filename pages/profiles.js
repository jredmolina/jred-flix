import { reactProductionProfiling } from "@/next.config";
import { getSession } from "next-auth/react";
import useCurrentUser from "@/hooks/useCurrentUser";
import React from "react";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default () => {
  const { data: user } = useCurrentUser();
  const router = useRouter();
  return (
    <div className="flex items-center h-full justify-center">
      <div className="flex flex-col">
        <h1 className="text-3xl md:text-6xl text-white text-center">
          Who is watching?
        </h1>
        <div
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-8 mt-10"
        >
          <div className="group flex-row w-44 mx-auto">
            <div
              className="w-44 h-44 rounded-md flex itmes-center justify-center border-2 
            border-transparent group-hover:cursor-pointer group-hover:border-white overflow-hidden"
            >
              <img src="/images/default-blue.png" alt="Profile" />
            </div>
            <div className="mt-4 text-gray-400 text-2xl text-center group-hover:text-white">
              {user?.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useUser } from "@clerk/nextjs";
import { InferQueryResult } from "@trpc/react-query/dist/utils/inferReactQueryProcedure";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import { api, RouterOutputs } from "~/utils/api";

const TopNav = () => {
  const user = useUser();

  return (
    <nav className="flex w-full flex-wrap items-center justify-between bg-gray-800 p-6 shadow-lg">
      <div className="mr-6 flex flex-shrink-0 items-center text-white">
        <span className="text-xl font-semibold tracking-tight">😶 Emojer</span>
      </div>
      <div>
        <img
          src={user.user?.profileImageUrl}
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
      </div>
    </nav>
  );
};

type TweetData = RouterOutputs["example"]["getAll"][number];

const TweetView = (props: { tweet: TweetData }) => {
  return (
    <div className="border-t border-zinc-700 p-4 shadow-lg">
      <div className="flex items-center">
        <img
          src={props.tweet.user.profileImageUrl}
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
        <div className="ml-3">
          <div className="text-sm font-bold text-gray-500">
            {"@" + props.tweet.user.username}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-gray-700">{props.tweet.content}</div>
      </div>
      <div className="mt-4">
        <div className="text-sm text-gray-500">
          {new Date(props.tweet.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

const CreatePostWizard = () => {
  const [content, setContent] = useState("");

  const { mutate, isLoading } = api.example.createPost.useMutation({
    onSuccess: () => setContent(""),
  });

  return (
    <div className="flex w-48 justify-center p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
      />
      <button onClick={() => mutate({ message: content })}>Create</button>
    </div>
  );
};

const Feed = () => {
  const { data } = api.example.getAll.useQuery();
  return (
    <div className="flex h-full w-[600px] grow flex-col border-l border-r border-zinc-700">
      <CreatePostWizard />
      {data?.map((post) => (
        <TweetView key={post.id} tweet={post} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>😶 Emojer</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-black text-white">
        {/* <TopNav /> */}

        <Feed />
      </main>
    </>
  );
};

export default Home;

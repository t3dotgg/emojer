import { useClerk, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import { TweetView } from "~/components/post-view";
import { LoadingPage } from "~/components/loading";
import Link from "next/link";

const CreatePostWizard = () => {
  const [content, setContent] = useState("");

  const ctx = api.useContext();
  const { mutate, isLoading, error } = api.posts.createPost.useMutation({
    onSuccess: () => {
      setContent("");
      ctx.invalidate();
    },
  });

  const { user } = useUser();

  return (
    <div className="relative flex w-full">
      <Link href={`/profile/${user?.username}`}>
        <img
          src={user?.profileImageUrl}
          alt="Profile"
          className="m-4 h-14 w-14 rounded-full"
        />
      </Link>
      <div>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              mutate({ message: content });
            }
          }}
          disabled={isLoading}
          className="my-4 grow bg-transparent py-4 pr-20 text-xl outline-none"
          placeholder="Type some emojis"
          autoFocus
        />
        {error?.data?.zodError?.fieldErrors.message && (
          <span className="mb-8 text-red-500">
            {error.data.zodError.fieldErrors.message}
          </span>
        )}
      </div>
      <div className="absolute right-2 flex h-full flex-col justify-center">
        {!!content && (
          <button onClick={() => mutate({ message: content })}>POST!</button>
        )}
      </div>
    </div>
  );
};

const CustomSignIn = () => {
  const { openSignIn } = useClerk();

  return (
    <div className="flex flex-col items-center justify-center text-xl">
      <button onClick={() => openSignIn()}>Sign In</button>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  const { isLoaded: userLoaded, user } = useUser();

  if (postsLoading || !userLoaded) return <LoadingPage />;

  return (
    <div className="flex h-full w-full grow flex-col border-l border-r border-zinc-700 md:w-[600px]">
      {!user && <CustomSignIn />}
      {user && <CreatePostWizard />}
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-black text-white">
        <Feed />
      </main>
    </>
  );
};

export default Home;

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { api, RouterOutputs } from "~/utils/api";

type TweetData = RouterOutputs["posts"]["getAll"][number];

const TweetView = (props: { tweet: TweetData }) => {
  return (
    <div className="border-t border-zinc-700 p-4 shadow-lg">
      <div className="flex items-center">
        <img
          src={props.tweet.user.profileImageUrl}
          alt="Profile"
          className="h-14 w-14 rounded-full"
        />
        <div className="ml-3 flex flex-col text-2xl">
          <div className="text-base font-bold text-slate-300">
            <span>{`@${props.tweet.user.username}`}</span>
            <span className="font-thin">{` · ${dayjs(
              props.tweet.createdAt
            ).fromNow()}`}</span>
          </div>
          <div className="text-slate-300">{props.tweet.content}</div>
        </div>
      </div>
    </div>
  );
};

const Feed = (props: { id: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    id: props.id,
  });

  if (isLoading)
    return (
      <div className="absolute flex h-screen w-screen items-center justify-center">
        <Loading size={128} />
      </div>
    );

  return (
    <>
      {data?.map((post) => (
        <TweetView key={post.id} tweet={post} />
      ))}
    </>
  );
};

const PostView = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data } = api.profile.getProfileByUsername.useQuery({
    username: props.slug,
  });
  console.log("data", data);

  if (!data) return <div>Not Found</div>;

  return (
    <>
      <Head>
        <title>{data.username}'s Profile</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-black text-white">
        <div className="flex h-full w-full grow flex-col border-l border-r border-zinc-700 md:w-[600px]">
          <div className="h-36 w-full bg-gray-500" />
          <img
            src={data.profileImageUrl}
            className="-mt-16 ml-2 h-32 w-32 overflow-hidden rounded-full border-2 border-black"
          />
          <div className="px-4 pb-4 text-2xl font-bold">@{data.username}</div>
          <Feed id={data.id} />
        </div>
      </main>
    </>
  );
};

export default PostView;

import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { Loading } from "~/components/loading";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson,
  });
  const slug = context.params?.slug as string;

  await ssg.profile.getProfileByUsername.prefetch({ username: slug });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  };
}

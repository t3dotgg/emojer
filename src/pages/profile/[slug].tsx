import { GetStaticProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { api } from "~/utils/api";

const Feed = (props: { id: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    id: props.id,
  });

  if (isLoading) return <LoadingPage />;

  return (
    <>
      {data?.map((post) => (
        <TweetView key={post.id} tweet={post} />
      ))}
    </>
  );
};

const ProfileView = (
  props: InferGetServerSidePropsType<typeof getStaticProps>
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

export default ProfileView;

import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { TweetView } from "~/components/post-view";
import { LoadingPage } from "~/components/loading";

export const getStaticProps: GetStaticProps = async (context) => {
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
};

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

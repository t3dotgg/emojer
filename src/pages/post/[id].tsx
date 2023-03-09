import { GetStaticProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { api } from "~/utils/api";

const PostView = (
  props: InferGetServerSidePropsType<typeof getStaticProps>
) => {
  const { data } = api.posts.getPostById.useQuery({ id: props.id });

  if (!data) {
    return <div>Not found</div>;
  }

  return (
    <>
      <Head>
        <title>{`${data.content} - @${data.user.username}`}</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-black text-white">
        <div className="flex h-full w-full grow flex-col border-l border-r border-zinc-700 md:w-[600px]">
          <TweetView tweet={data} noPostLink />
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
import { TweetView } from "~/components/post-view";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson,
  });
  const id = context.params?.id as string;

  await ssg.posts.getPostById.prefetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

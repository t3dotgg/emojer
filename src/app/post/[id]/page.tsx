import { TweetView } from "~/app/tweets";
import { createCaller } from "~/utils/trpc-server-caller";

export default async function PostPage({ params }: { params: { id: string } }) {
  const data = await createCaller().example.getPostById({ id: params.id });
  return (
    <div className="flex h-full w-full grow flex-col border-l border-r border-zinc-700 md:w-[600px]">
      {" "}
      <TweetView tweet={data} />
    </div>
  );
}

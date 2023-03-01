import Link from "next/link";
import { RouterOutputs } from "~/utils/api";
import { createCaller } from "~/utils/trpc-server-caller";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type TweetData = RouterOutputs["example"]["getAll"][number];

export const TweetView = (props: { tweet: TweetData }) => {
  return (
    <div className="border-t border-zinc-700 p-4 shadow-lg">
      <Link href={`/post/${props.tweet.id}`}>
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
      </Link>
    </div>
  );
};

export default async function Tweets() {
  const data = await createCaller().example.getAll();

  return (
    <>
      {data?.map((post) => (
        <TweetView key={post.id} tweet={post} />
      ))}
    </>
  );
}

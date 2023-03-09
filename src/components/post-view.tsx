import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import React from "react";

dayjs.extend(relativeTime);

import { RouterOutputs } from "~/utils/api";

const Timestamp = (props: { createdAt: Date; link?: string }) => {
  const core = (
    <span className="font-thin">{` · ${dayjs(
      props.createdAt
    ).fromNow()}`}</span>
  );

  if (props.link)
    return (
      <Link href={props.link} className="pointer-events-auto">
        {core}
      </Link>
    );

  return core;
};

type TweetData = RouterOutputs["posts"]["getAll"][number];
export const TweetView = React.memo(
  (props: { tweet: TweetData; noPostLink?: boolean }) => {
    return (
      <div className="relative border-t border-zinc-700 p-4 shadow-lg">
        {!props.noPostLink && (
          <Link
            href={`/post/${props.tweet.id}`}
            className="absolute left-0 top-0 z-0 h-full w-full"
          />
        )}
        <div className="pointer-events-none relative z-10 flex items-center">
          <Link
            href={`/profile/${props.tweet.user.username}`}
            className="pointer-events-auto"
          >
            <img
              src={props.tweet.user.profileImageUrl}
              alt={`Profile for ${props.tweet.user.username}`}
              className="h-14 w-14 rounded-full"
            />
          </Link>
          <div className="ml-3 flex flex-col text-2xl">
            <div className="text-base font-bold text-slate-300">
              <Link
                href={`/profile/${props.tweet.user.username}`}
                className="pointer-events-auto"
              >
                <span>{`@${props.tweet.user.username}`}</span>
              </Link>

              <Timestamp
                createdAt={props.tweet.createdAt}
                link={props.noPostLink ? undefined : `/post/${props.tweet.id}`}
              />
            </div>
            <div className="text-slate-300">{props.tweet.content}</div>
          </div>
        </div>
      </div>
    );
  }
);

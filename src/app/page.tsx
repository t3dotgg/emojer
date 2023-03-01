import { currentUser, SignIn } from "@clerk/nextjs/app-beta";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Suspense } from "react";

dayjs.extend(relativeTime);

import CreatePostWizard from "./compose";
import Tweets from "./tweets";

const Feed = async () => {
  const self = await currentUser();
  return (
    <div className="flex h-full w-full grow flex-col border-l border-r border-zinc-700 md:w-[600px]">
      {self && <CreatePostWizard self={self} />}
      {!self && <SignIn />}
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component */}
        <Tweets />
      </Suspense>
    </div>
  );
};

const HomeFeed = () => {
  /* @ts-expect-error Server Component */
  return <Feed />;
};

export default HomeFeed;

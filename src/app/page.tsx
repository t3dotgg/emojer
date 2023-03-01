import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import CreatePostWizard from "./compose";
import Tweets from "./tweets";

const Feed = () => {
  return (
    <div className="flex h-full w-full grow flex-col border-l border-r border-zinc-700 md:w-[600px]">
      <CreatePostWizard />
      {/* @ts-expect-error Server Component */}
      <Tweets />
    </div>
  );
};

const HomeFeed = () => {
  return <Feed />;
};

export default HomeFeed;

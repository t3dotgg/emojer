"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const CreatePostWizard = () => {
  const [content, setContent] = useState("");

  //   const ctx = api.useContext();
  //   const { mutate, isLoading } = api.example.createPost.useMutation({
  //     onSuccess: () => {
  //       setContent("");
  //       //   ctx.invalidate();
  //     },
  //   });

  const mutate = () => null;
  const isLoading = false;

  const { user } = useUser();

  return (
    <div className="relative flex w-full">
      <img
        src={user?.profileImageUrl}
        alt="Profile"
        className="m-4 h-14 w-14 rounded-full"
      />
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
        className="my-4 grow bg-transparent py-4 pr-20 text-xl outline-none"
        placeholder="Type some emojis"
        autoFocus
      />
      <div className="absolute right-2 flex h-full flex-col justify-center">
        {!!content && (
          <button onClick={() => mutate({ message: content })}>POST!</button>
        )}
      </div>
    </div>
  );
};

export default CreatePostWizard;

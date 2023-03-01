"use client";

import type { User } from "@clerk/nextjs/dist/api";
import { useState } from "react";

const CreatePostWizard = (props: { self: User }) => {
  const [content, setContent] = useState("");

  //   const ctx = api.useContext();
  //   const { mutate, isLoading } = api.example.createPost.useMutation({
  //     onSuccess: () => {
  //       setContent("");
  //       //   ctx.invalidate();
  //     },
  //   });

  const mutate = (input: { message: string }) => null;
  const isLoading = false;

  return (
    <div className="relative flex w-full">
      <img
        src={props.self?.profileImageUrl}
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

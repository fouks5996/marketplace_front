import React from "react";
import {
  errorMessageValues,
  errorInput,
  errorMessage,
} from "../../components/auth/errors";
import { useForm } from "react-hook-form";
import { API } from "../../utils/variables";
import Cookies from "js-cookie";
import { useAtomValue, useSetAtom } from "jotai";
import { currentuser } from "../../components/atoms/logged";
import { firstchatterAtom } from "../../components/atoms/firstChatter";

const PostChat = ({ forceUpdate, recipient_id }) => {
  const token = Cookies.get("token");
  const currentUser = useAtomValue(currentuser);
  const setChatter = useSetAtom(firstchatterAtom);
  const chatterValue = useAtomValue(firstchatterAtom);
  console.log(chatterValue);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    fetch(API + "messages", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: {
          sender_id: currentUser.id,
          recipient_id,
          content: data.content,
        },
      }),
    })
      .then((response) => {
        setChatter(recipient_id);
        forceUpdate();

        return response.json();
      })
      .then((res) => {
        emptyInput();
      });
  };

  const emptyInput = () => {
    const input = document.getElementById("toDelete");
    return (input.value = "");
  };

  return (
    <div className="w-full flex border-t border-slate-200 mt-4  justify-end">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" flex gap-3 mt-4 mb-6 items-center w-full justify-between"
      >
        <input
          className={`border h-16 pl-6 rounded-full w-full  ${errorInput(
            errors.content
          )}`}
          autoFocus="true"
          id="toDelete"
          type="text"
          size={10}
          {...register("content", errorMessageValues.content)}
        />
        {errorMessage(errors.content)}
        <button
          className="py-2 px-4 h-fit text-xl rounded-full text-white bg-slate-800"
          type="submit"
        >
          {" "}
          Envoyer{" "}
        </button>
      </form>
    </div>
  );
};

export default PostChat;

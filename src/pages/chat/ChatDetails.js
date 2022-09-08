import React, { useEffect, useReducer, useState } from "react";
import { useAtomValue } from "jotai";
import { currentuser } from "../../components/atoms/logged";
import { API } from "../../utils/variables";
import Cookies from "js-cookie";
import PostChat from "./PostChat";

function ChatDetails({ data, forceUpdate, reducerValue }) {
  const [message, setMessage] = useState();
  const currentUser = useAtomValue(currentuser);
  const token = Cookies.get("token");

  useEffect(() => {
    fetch(API + "messages", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMessage(data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducerValue]);

  if (!data)
    return (
      <div className="w-full h-screen leading-[100vh] text-center text-3xl text-gray-500">
        {" "}
        Pas de Message sélectionnée{" "}
      </div>
    );

  function dataParsed(date) {
    return new Date(date).toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  setTimeout(() => {
    const elem = document.getElementById("chatWrapper");
    elem.scrollTop = elem.scrollHeight;
  }, "10");

  return (
    <div className="w-full border-l border-slate-200 h-screen px-20 ">
      <h1 className="text-center text-3xl font-bold pb-16 pt-8">
        {" "}
        {data.user}{" "}
      </h1>
      <div
        id="chatWrapper"
        className="flex flex-col gap-1 max-h-[500px] overflow-y-scroll"
      >
        {message &&
          message
            .filter(
              (mess) =>
                (mess.sender_id === data.id &&
                  mess.recipient_id === currentUser.id) ||
                (mess.recipient_id === data.id &&
                  mess.sender_id === currentUser.id)
            )
            .sort((a, b) => {
              return new Date(a.created_at) - new Date(b.created_at);
            })
            .map((mess) => (
              <>
                {mess.sender_id === currentUser.id ? (
                  <>
                    <p className="text-white p-3 bg-red-500 self-end rounded-lg w-max max-w-sm">
                      {" "}
                      Moi: {mess.content}
                    </p>

                    <p className="self-end mt-[-2px] mb-2 text-sm font-light">
                      {" "}
                      {dataParsed(mess.created_at)}{" "}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-white p-3  bg-blue-500 w-fit rounded-lg max-w-sm">
                      {" "}
                      {mess.content}
                    </p>

                    <p className="mt-[-2px] mb-2 text-sm font-light">
                      {" "}
                      {dataParsed(mess.created_at)}{" "}
                    </p>
                  </>
                )}
              </>
            ))}
      </div>
      <PostChat forceUpdate={forceUpdate} recipient_id={data.id} />
    </div>
  );
}

export default ChatDetails;

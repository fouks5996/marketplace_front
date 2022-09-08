import React, { useEffect, useReducer, useState } from "react";
import ChatDetails from "./ChatDetails";
import Chatlist from "./Chatlist";
import { API } from "../../utils/variables";
import Cookies from "js-cookie";
import { currentuser } from "../../components/atoms/logged";
import { useAtomValue } from "jotai";
import { firstchatterAtom } from "../../components/atoms/firstChatter";

function Chat(props) {
  const token = Cookies.get("token");
  const firstChatterValue = useAtomValue(firstchatterAtom);
  const [chatterList, setChatterList] = useState();
  const [currentMessage, setCurrentMessage] = useState(firstChatterValue);
  const currentUser = useAtomValue(currentuser);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    fetch(API + "messages", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let filtered = data.filter(
          (message) =>
            message.sender_id === currentUser.id ||
            message.recipient_id === currentUser.id
        );

        filtered = filtered.filter(
          (message) => message.sender_id !== message.recipient_id
        );

        setSender(filtered);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducerValue]);

  const setSender = (dataTofilter) => {
    let senderArray = [];
    dataTofilter.map((data) => {
      return senderArray.push({
        user: data.sender.email,
        message: data.content,
        date: data.created_at,
        id: data.sender_id,
      });
    });
    return setRecipient(dataTofilter, senderArray);
  };

  const setRecipient = (dataTofilter, senderArray) => {
    let recipientArray = [];
    dataTofilter.map((data) => {
      return recipientArray.push({
        user: data.recipient.email,
        message: data.content,
        date: data.created_at,
        id: data.recipient_id,
      });
    });
    return mergeArrays(senderArray, recipientArray);
  };

  const mergeArrays = (arr1, arr2) => {
    let mergedArray = arr1
      .concat(arr2)
      .filter((el) => {
        return el.user !== currentUser.email;
      })
      .filter((v, i, a) => a.findIndex((t) => t.user === v.user) === i);
    return setChatterList(mergedArray);
  };

  const getCurrentMessage = () => {
    return (
      chatterList &&
      chatterList.find((message) => message.id === currentMessage)
    );
  };

  return (
    <div className="flex">
      <div className="min-w-[500px] pl-12">
        <Chatlist
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          chatterList={chatterList}
        />
      </div>

      <ChatDetails
        data={getCurrentMessage()}
        forceUpdate={forceUpdate}
        reducerValue={reducerValue}
      />
    </div>
  );
}

export default Chat;

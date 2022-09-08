import React from "react";

function Chatlist({ chatterList, currentMessage, setCurrentMessage }) {
  function dataParsed(date) {
    return new Date(date).toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  return (
    <div className="relative ">
      <h1 className="text-2xl py-6 font-bold">Liste des conversations :</h1>
      {chatterList &&
        chatterList
          .sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })
          .map((data) => (
            <div
              className={` cursor-pointer border-b border-slate-200 hover:bg-slate-100 py-4 mb-2 rounded-lg pl-4 relative ${
                currentMessage === data.id && "bg-slate-300 hover:bg-slate-300"
              }`}
              onClick={() => setCurrentMessage(data.id)}
            >
              <p className="font-bold text-lg mb-2"> {data.user}</p>
              <p> {data.message}</p>
              <p className="absolute top-4 right-4 text-sm font-light">
                {" "}
                {dataParsed(data.date)}
              </p>
            </div>
          ))}
    </div>
  );
}

export default Chatlist;

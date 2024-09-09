export default function addToMessageArchive(params, id) {
  if (!params || !id) return;
  const filtered = Object.entries(params).flatMap(([_, v]) =>
    Object.entries(v).flatMap(([key, val]) => {
      if (key === "metadata") {
        return val.map((c) => ({
          chatID: v.id,
          receiver: v.receiver,
          sender: v.sender,
          text: c?.msg,
          time: c?.time,
          isEnd: c?.user_id === id,
        }));
      } else {
        return [];
      }
    })
  );
  return filtered;
}

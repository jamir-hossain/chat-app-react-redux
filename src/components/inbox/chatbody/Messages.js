import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { messagesApi } from "../../../features/messages/messagesApi";
import Message from "./Message";

export default function Messages(props) {
  const { messages = [], totalCount, conversationId } = props;
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();

  const fetchMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (page > 1) {
      dispatch(
        messagesApi.endpoints.getMoreMessages.initiate({
          id: conversationId,
          page,
        })
      );
    }
  }, [page, conversationId, dispatch]);

  useEffect(() => {
    if (totalCount > 0) {
      const more =
        Math.ceil(
          totalCount / Number(process.env.REACT_APP_CONVERSATIONS_PER_PAGE)
        ) > page;

      setHasMore(more);
    }
  }, [totalCount, page]);

  return (
    <div
      id="scrollableDiv"
      style={{
        height: window.innerHeight - 200,
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchMore}
        style={{ display: "flex", flexDirection: "column-reverse" }}
        inverse={true} //
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >
        <div className="relative w-full p-6 overflow-y-auto flex flex-col-reverse">
          <ul className="space-y-2">
            {messages
              .slice()
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((message) => {
                const { message: lastMessage, id, sender } = message || {};

                const justify = sender.email !== email ? "start" : "end";

                return (
                  <Message key={id} justify={justify} message={lastMessage} />
                );
              })}
          </ul>
        </div>
      </InfiniteScroll>
    </div>
  );
}

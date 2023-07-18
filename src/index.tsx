import { Action, ActionPanel, Icon, List } from "@raycast/api";

import { Message } from "./types";
import { useMessages } from "./messages";
import { useState } from "react";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const { isLoading, data, permissionView } = useMessages();

  // useInterval(revalidate, POLLING_INTERVAL);

  if (permissionView) {
    return permissionView;
  }

  return (
    <List isLoading={isLoading} searchText={searchText} isShowingDetail onSearchTextChange={setSearchText}>
      {data?.length ? (
        data.map((message) => {
          return (
            <List.Item
              key={message.guid}
              icon={Icon.Message}
              title={message.sender}
              detail={<Detail message={message} />}
              actions={<Actions message={message} />}
            />
          );
        })
      ) : (
        <List.EmptyView title="No new messages" />
      )}
    </List>
  );
}

function Detail(props: { message: Message }) {
  return (
    <List.Item.Detail
      markdown={props.message.text}
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="Date" text={new Date(props.message.message_date).toLocaleString()} />
        </List.Item.Detail.Metadata>
      }
    />
  );
}

function Actions(props: { message: Message }) {
  return (
    <ActionPanel title="Action">
      <ActionPanel.Section>
        <Action.CopyToClipboard
          content={props.message.text}
          title="Copy Message"
          shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
}

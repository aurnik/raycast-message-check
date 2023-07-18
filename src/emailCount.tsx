import { useEffect, useState } from "react";

import { MenuBarExtra } from "@raycast/api";
import { useEmails } from "./messages";

export default function Command() {
  const { isLoading, data } = useEmails();
  console.log(data);
  if (!isLoading && (!data || !data[0].unreadCount)) return null;
  return (
    <MenuBarExtra
      title={data ? "📬 " + data[0].unreadCount.toString() : "Loading"}
      tooltip="New emails"
      isLoading={isLoading}
    >
      <MenuBarExtra.Item
        title={"Open emails"}
        onAction={() => {
          // open Messages
        }}
      />
    </MenuBarExtra>
  );
  // return null;
}

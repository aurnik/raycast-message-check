import { MenuBarExtra } from "@raycast/api";
import { useMessages } from "./messages";

export default function Command() {
  const { isLoading, data } = useMessages();
  if (!isLoading && !data?.length) return null;
  return (
    <MenuBarExtra title={"💬 " + (data?.length || 0).toString()} tooltip="New messages" isLoading={isLoading}>
      <MenuBarExtra.Item
        title={"Open messages"}
        onAction={() => {
          // open Messages
        }}
      />
    </MenuBarExtra>
  );
}

import { Message, Preferences, UnreadEmailQuery } from "./types";

import { exec } from "child_process";
import { getPreferenceValues } from "@raycast/api";
import { homedir } from "os";
import { resolve } from "path";
import { useSQL } from "@raycast/utils";
import util from "util";

const execAsync = util.promisify(exec);

const MESSAGE_DB_PATH = resolve(homedir(), "Library/Messages/chat.db");
const EMAIL_DB_PATH = resolve(
  homedir(),
  "Library/Containers/com.apple.mail/Data/Library/Mail/V10/MailData/Envelope Index"
);

function getBaseQuery() {
  const preferences = getPreferenceValues<Preferences>();
  const lookBackDays = parseInt(preferences?.lookBackDays || "1") || 1;
  const lookBackMinutes = lookBackDays * 24 * 60;
  return `
    select
      message.guid,
      message.rowid,
      ifnull(handle.uncanonicalized_id, chat.chat_identifier) AS sender,
      message.service,
      datetime(message.date / 1000000000 + 978307200, 'unixepoch', 'localtime') AS message_date,
      message.text
    from message
      left join chat_message_join on chat_message_join.message_id = message.ROWID
      left join chat on chat.ROWID = chat_message_join.chat_id
      left join handle on message.handle_id = handle.ROWID
    where message.is_from_me = 0
      and message.is_read = 0
      and message.text is not null
      and length(message.text) > 0
      and datetime(message.date / 1000000000 + strftime('%s', '2001-01-01'), 'unixepoch', 'localtime') >= datetime('now', '-${lookBackMinutes} minutes', 'localtime')
  `;
}

function getQuery() {
  return `${getBaseQuery()} \norder by message.date desc limit 100`.trim();
}

export function useMessages() {
  const query = getQuery();
  return useSQL<Message>(MESSAGE_DB_PATH, query);
}

export function useEmails() {
  return useSQL<UnreadEmailQuery>(
    EMAIL_DB_PATH,
    `SELECT SUM(unread_count) as unreadCount FROM mailboxes WHERE url LIKE "%INBOX"`
  );
}

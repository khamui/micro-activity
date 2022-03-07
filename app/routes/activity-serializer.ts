interface TMessage {
  created_at: string;
  diff_days: number;
  platform: string;
  messages:
    | string[]
    | [
        {
          [key: string]: any;
        }
      ];
  html_url?: string;
  coding_lang?: any;
  action?: string;
  messagetype?: string;
  messagelength?: number;
}

const calcDiffDays = (createdDate: string) => {
  const now = Date.now();
  const cdate = Date.parse(createdDate);
  return (now - cdate) / 1000 / 60 / 60 / 24;
};

export const activitySerializer = (
  messages: string[] = ["Unknown activity."],
  platform = "UNKNOWN",
  created_at = "n/a",
  html_url?: string,
  coding_lang?: any,
  action?: string,
  messagetype?: string
): TMessage => {
  return {
    messages,
    platform,
    created_at,
    html_url,
    coding_lang,
    diff_days: calcDiffDays(created_at),
    action,
    messagetype,
  };
};

import { activitySerializer } from "../serializers/activity-serializer";

interface TTwitterActivity {
  created_at: string;
  id: string;
  text: string;
}

export const ActivityAdapterTwitter = (activity: TTwitterActivity) => {
  const { created_at, text } = activity;
  const platform = "TWITTER.COM";
  if (text) {
    return activitySerializer(
      [text],
      platform,
      created_at,
      undefined,
      undefined,
      "tweet"
    );
  }
 else {
    return activitySerializer(["unknown"], platform);
  }
};

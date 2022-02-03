import { activitySerializer } from './activity-serializer';

interface TTwitterActivity {
  created_at: string,
  id: string,
  text: string
}

export const ActivityAdapterTwitter = (activity: TTwitterActivity) => {
  const {created_at, text} = activity;
  const platform = 'TWITTER.COM';
  if (text) {
    return activitySerializer([text], platform, created_at, undefined, undefined, "tweet");
  }
  else {
    return activitySerializer(["unknown"], platform);
  }
}

const map = (list: [{message: string}]) => {
  return list.map(i => i.message);
}


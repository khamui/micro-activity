import { useLoaderData } from "remix";
import type { LinksFunction } from "remix";
import stylesHref from "../styles/index.css";
import { Activity } from "./activity";
import { ActivityAdapterGithub } from './activity-adapter-github';
import { ActivityAdapterTwitter } from './activity-adapter-twitter';

interface TResponseData {
  github: any,
  github_files: any,
  twitter: any
};

export const links: LinksFunction = () => {
  return [
    // add a favicon
    {
      rel: "icon",
      href: "/favicon.png",
      type: "image/png"
    },

    // add a local stylesheet, remix will fingerprint the file name for
    // production caching
    { rel: "stylesheet", href: stylesHref},

  ];
};

const serializeActivities = (responseData: TResponseData) => {
  const serializedGithubData = 
    responseData.github
      .map((activityGithub) => ActivityAdapterGithub(activityGithub, responseData.github_files));
  const serializedTwitterData = 
    responseData.twitter.data
      .map((activityTwitter) => ActivityAdapterTwitter(activityTwitter));

  return [...serializedGithubData, ...serializedTwitterData];
}

const byDiffDays = (a, b) => {
  if (a.diff_days < b.diff_days){
    return -1;
  }
  if (a.diff_days > b.diff_days ){
    return 1;
  }
  return 0;
}

const fetchConvert = async (apiUrl: string, headers: any) => {
  const response = await fetch(apiUrl, headers);
  return response.json();
};

const getFilesUrls = (inputData: any) => {
  return inputData
    .filter((ghActivity: any) => ghActivity.type === 'PushEvent')
    .map((pushActivity:any) => {
      return pushActivity.payload.commits[0].url;
    });
};  


export const loader = async () => {
  const responseData: TResponseData = { github: [], github_files: [], twitter: [] }; 

  const twitterToken = process.env.TWITTER_BEARER_TOKEN;
  const twitterId = process.env.TWITTER_USER_ID;
  const githubToken = process.env.GITHUB_TOKEN;
  const githubUser = process.env.USER;

  // Github data fetching + dependent fetching (files)
  const githubUrl = `https://api.github.com/users/${githubUser}/events`;
  const githubHeaders = {
    'Authorization': `token ${githubToken}`,
  }
  responseData.github = await fetchConvert(githubUrl, { headers: githubHeaders });
  const filesApiUrls = await getFilesUrls(responseData.github);
  responseData.github_files = await Promise.all(
    await filesApiUrls.map((filesUrl: string) => fetchConvert(filesUrl, { headers: githubHeaders }))
  ); 

  // Twitter data fetching
  const twitterUrl = `https://api.twitter.com/2/users/${twitterId}/tweets?tweet.fields=created_at`
  const twitterHeaders = {
    'Authorization': `Bearer ${twitterToken}`,
  }
  const rawTwitter = await fetch(twitterUrl, { headers: twitterHeaders });
  responseData.twitter = await rawTwitter.json(); 
  
  const serializedResponseData = serializeActivities(responseData);
  const sortedResponseData = serializedResponseData.sort(byDiffDays);
  return sortedResponseData;
}

export default function Activities() {
  const activities = useLoaderData();
  return (
    <div className="page-container">
      <div className="activities-container collapsed">
        {activities.map((activity: Object, idx: number) =>
          <Activity key={`activity_${idx}`} data={activity} />)}
      </div>
    </div>
  );
}

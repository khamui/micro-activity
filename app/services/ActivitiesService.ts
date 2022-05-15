import { ActivityAdapterGithub } from './adapters/activity-adapter-github';
import { ActivityAdapterTwitter } from './adapters/activity-adapter-twitter';
import C from "../miconfig";

interface TResponseData {
  github: any;
  github_files: any;
  twitter: any;
}

export class ActivitiesService {
  constructor() {
    console.log('ActivitiesService initialized');
  }

  byDiffDays = (a: { diff_days: number }, b: { diff_days: number }) => {
    if (a.diff_days < b.diff_days) {
      return -1;
    }
    if (a.diff_days > b.diff_days) {
      return 1;
    }
    return 0;
  };

  serializeActivities = (responseData: TResponseData) => {
    const { twitter, github, github_files } = responseData;
    const filteredGithub = github
      .filter((a: any) => !a.org || !C.excludedOrgs.includes(a.org.login));
    const serializedGithubData = filteredGithub.map((activityGithub: any) => {
      return ActivityAdapterGithub(activityGithub, github_files)
    });
    const serializedTwitterData = twitter.data.map((activityTwitter: any) =>
      ActivityAdapterTwitter(activityTwitter)
    );

    return [...serializedGithubData, ...serializedTwitterData];
  };

  fetchConvert = async (apiUrl: string, headers: any) => {
    const response = await fetch(apiUrl, headers);
    return response.json();
  };

  getFilesUrls = (inputData: any) => {
    return inputData
      .filter((ghActivity: any) => ghActivity.type === "PushEvent")
      .map((pushActivity: any) => {
        return pushActivity.payload.commits[0].url;
      });
  };

  getProvider = (providerName: string) => {
    return C.providers.find((provider: any) => provider.name === providerName);
  };

  loader = async () => {
    const responseData: TResponseData = {
      github: [],
      github_files: [],
      twitter: [],
    };

    const twitterToken = process.env.TWITTER_BEARER_TOKEN as string;
    const twitterId = process.env.TWITTER_USER_ID as string;
    const githubToken = process.env.GITHUB_TOKEN as string;
    const githubUser = process.env.USER as string;

    // Github data fetching + dependent fetching (files)
    const gh = this.getProvider("github") as any;
    const githubHeaders = {
      Authorization: gh.token.replace("$githubToken", githubToken),
    };
    responseData.github = await this.fetchConvert(
      gh.apiUrl.replace("$githubUser", githubUser),
      { headers: githubHeaders }
    );
    const filesApiUrls = await this.getFilesUrls(responseData.github);
    responseData.github_files = await Promise.all(
      await filesApiUrls.map((filesUrl: string) =>
        this.fetchConvert(filesUrl, { headers: githubHeaders })
      )
    );

    // Twitter data fetching
    const tw = this.getProvider("twitter") as any;
    const twitterHeaders = {
      Authorization: tw.token.replace("$twitterToken", twitterToken),
    };
    const rawTwitter = await fetch(tw.apiUrl.replace("$twitterId", twitterId), {
      headers: twitterHeaders,
    });
    responseData.twitter = await rawTwitter.json();

    const serializedResponseData = this.serializeActivities(responseData);
    const sortedResponseData = serializedResponseData.sort(this.byDiffDays);
    const filteredResponseData = sortedResponseData.filter(
      (a: any) => !C.excludedTypes.includes(a.messagetype)
    );

    return filteredResponseData;
  }
}

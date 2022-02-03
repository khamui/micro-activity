import { useLoaderData } from "remix";
import { activitySerializer } from './activity-serializer';

interface TActivity {
  created_at: string,
  type: string,
  payload: { 
    [key: string]: any
  },
  repo?: any
}

const fetchFiles = async (commitUrl: string) => {
  const res = await fetch(commitUrl);
  const data = await res.json();
  return data.files;
};

const getExtensionOf = (commitFile: any) => {
  const regex = /\.[0-9a-z]+$/i;
  return commitFile.filename.match(regex)[0];
};

export const ActivityAdapterGithub = (activity: TActivity, files: any) => {
  const {type, payload, created_at, repo} = activity;
  const platform = 'GITHUB.COM';
  if (type === "PushEvent") {
    // FIXME: checking all commits instead of just the first?
    const matchingFile = files
      .filter((file: any) => file.sha === payload.commits[0].sha)
      .map((file: any) => file.files[0]);
    const coding_lang = getExtensionOf(matchingFile[0]);
    const multipleMessages = map(payload.commits);

    return activitySerializer(
      map(payload.commits),
      platform,
      created_at,
      undefined,
      coding_lang,
      "code submitted.",
      "commit"
    );
  }
  else if (type === "IssueCommentEvent") {
    return activitySerializer(
      [payload.comment.body],
      platform,
      created_at,
      payload.comment.html_url,
      undefined,
      "commented.",
      "comment"
    );
  }
  else if (type === "DeleteEvent") {
    return activitySerializer(
      [payload.ref],
      platform,
      created_at,
      undefined,
      undefined,
      "branch deleted.",
      payload.ref_type
    )
  }
  else if (type === "CreateEvent") {
    const message = payload.ref_type === 'repository'
      ? activity.repo.name
      : payload.ref
    const action = payload.ref_type === 'repository'
      ? 'repository'
      : 'branch'
    return activitySerializer(
      [message],
      platform,
      created_at,
      undefined,
      undefined,
      `new ${action} created.`,
      payload.ref_type
    )
  }
  else if (type === "PullRequestEvent") {
    const action = payload.action === "opened"
      ? "review requested."
      : "closed (merge or abort).";

    return activitySerializer(
      [payload.pull_request.title],
      platform,
      created_at,
      payload.pull_request.html_url,
      undefined,
      action,
      "pull-request"
    )
  }
  else if (type === "PullRequestReviewEvent") {
    return activitySerializer(
      [payload.pull_request.title],
      platform,
      created_at,
      payload.review.hmtl_url,
      undefined,
      "activity on pull request detected.",
      "pull-request"
    )
  }
  else if (type === "PullRequestReviewCommentEvent") {
    return activitySerializer(
      [payload.comment.body],
      platform,
      created_at,
      payload.comment.html_url,
      undefined,
      "commented.",
      "pull-request"
    )
  }
  else if (type === "IssuesEvent") {
    return activitySerializer(
      [payload.issue.title],
      platform,
      created_at,
      payload.issue.html_url,
      undefined,
      "issue changed or modified",
      "issue"
    )
  }
  else {
    return activitySerializer(["unknown"]);
  }
}

const map = (list: [{message: string}]) => {
  return list.map(i => i.message);
}


import React, { useState } from "react";

const getDays = (diffDays: number) => {
  if (diffDays < 1) {
    return "Today";
  } else if (diffDays < 2) {
    return "Yesterday";
  } else {
    return `${Math.round(diffDays)} days ago`;
  }
};

export const Activity = (props: any) => {
  const { data } = props;
  const [currCommit, setCurrCommit] = useState(0);

  const hasMultiple = data.messages.length > 1;
  const hasLink = data.html_url;
  const platform = data.platform === "GITHUB.COM" ? "github" : "twitter";

  const prevCommitButton = () => {
    return setCurrCommit(currCommit - 1);
  };

  const nextCommitButton = () => {
    return setCurrCommit(currCommit + 1);
  };

  const codingLangBadge = () => {
    return (
      <span className="activity-card-info__coding-lang">
        {data.coding_lang}
      </span>
    );
  };

  return (
    <div className="activity-card">
      <div className={`activity-card-indicator--${platform}`} />
      <div className="activity-card-content">
        <div className="activity-card-info">
          <div className={`activity-card-info__header--${platform}`}>
            {data.platform}&nbsp; [{data.action}]{" "}
            {data.coding_lang && codingLangBadge()}
          </div>
          <div className="activity-card-info__messagetype">
            {data.messagetype}
          </div>
          <div className="activity-card-info__message">
            &quot;{data.messages[currCommit]}&quot;
          </div>
          <div className="activity-card-info__actions">
            {hasLink && (
              <div className="activity-card-info__link">
                <a href={data.html_url} target="_blank" rel="noreferrer">
                  Bring me there -&gt;
                </a>
              </div>
            )}
            {hasMultiple && (
              <div className="activity-card-info__crumb">
                <button
                  className="button--reset activity-card-commit__button"
                  onClick={prevCommitButton}
                >
                  &lt;&lt;
                </button>
                {`${currCommit + 1}/${data.messages.length}`}
                <button
                  className="button--reset activity-card-commit__button"
                  onClick={nextCommitButton}
                >
                  &gt;&gt;
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="activity-card-date">{getDays(data.diff_days)}</div>
      </div>
    </div>
  );
};

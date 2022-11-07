import React from "react";
import {
  SSRProvider,
  Box,
  Label,
  CircleBadge,
  Link,
  StyledOcticon,
  Truncate,
  Flash
} from "@primer/react";
import {
  LogoGithubIcon,
  ArrowRightIcon,
  GitCommitIcon,
  SquirrelIcon
} from "@primer/octicons-react";

const getDays = (diffDays: number) => {
  if (diffDays < 1) {
    return "Today";
  }
 else if (diffDays < 2) {
    return "Yesterday";
  }
 else {
    return `${Math.round(diffDays)} days ago`;
  }
};

const getDaysVariant = (diffDays: number) => {
  if (diffDays < 1) {
    return "success";
  }
  else if (diffDays < 2) {
    return "warning";
  }
  else {
    return "danger";
  }
};

export const Activity = (props: any) => {
  const { data, Timeline } = props;

  const codingLangLabel = () => {
    return (
      <Label variant="accent">
        {data.coding_lang}
      </Label>
    );
  };

  const contributionLabel = () => {
    return (
      <Label variant="secondary">
        {data.action}
      </Label>
    );
  };

  const typeLabel = () => {
    return (
      <Label variant="secondary">
        {data.messagetype}
      </Label>
    );
  };

  return (
    <Box
      p={3}
      my={3}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderColor="border.default"
      borderWidth={1}
      borderStyle="solid"
      borderRadius={6}
    >
      <Box display="flex" alignItems="center">
        <Box>
          <CircleBadge
            sx={{
              borderColor: 'neutral.subtle',
              borderWidth: 1,
              borderStyle: 'solid'
            }}
            variant="medium"
          >
            {data.platform === "GITHUB.COM"
              ? <LogoGithubIcon size={16} />
              : <SquirrelIcon size={24} />
            }
          </CircleBadge>
        </Box>
        <Box p={2}>
          <Box p={1}>
            {data.action && contributionLabel()}{" "}
            {data.messagetype && typeLabel()}{" "}
            {data.coding_lang && codingLangLabel()}
          </Box>
          <Box p={1}>
            <SSRProvider>
              <Timeline>
                {data.messages.map((message: any, index: number) => {
                  return (
                    <Timeline.Item condensed key={index}>
                      <Timeline.Badge>
                        <StyledOcticon icon={GitCommitIcon} />
                      </Timeline.Badge>
                      <Timeline.Body>
                        <Truncate maxWidth={500} title={message}>
                          {message}{" "}
                          <Link
                            sx={{fontSize: 1}}
                            href={data.html_url}
                          >
                            Go to{" "}
                            <ArrowRightIcon size={14} />
                          </Link>
                        </Truncate>
                      </Timeline.Body>
                    </Timeline.Item>
                  )
                })}
              </Timeline>
            </SSRProvider>
          </Box>
        </Box>
      </Box>
      <Box>
        <Flash
          sx={{
            fontSize: 1,
            color: `${getDaysVariant(data.diff_days)}.fg`
          }}
          variant={getDaysVariant(data.diff_days)}
        >
          {getDays(data.diff_days)}
        </Flash>
      </Box>
    </Box>
  );
};

import React from "react";
import { useLoaderData } from "remix";
import { Activity } from "./activity";
import { ActivitiesService } from "../services/ActivitiesService"
import {
  ThemeProvider,
  BaseStyles,
  Box,
  PageLayout,
  useTheme,
  ToggleSwitch,
  Link
} from "@primer/react";

export const loader = async () => {
  const AS = new ActivitiesService()
  return await AS.loader()
};

function SwitchButton() {
  const {colorMode, setColorMode} = useTheme()
  return (
    <ToggleSwitch
      aria-labelledby="switch-button-day-night-modes"
      onChange={
        () => setColorMode(colorMode === 'day' ? 'night' : 'day')
      }
    />
  );
}

export default function Index() {
  const activities = useLoaderData();

  return (
    <ThemeProvider
      nightScheme="dark_dimmed"
      preventSSRMismatch
    >
      <BaseStyles>
        <PageLayout sx={{bg: 'canvas.default'}}>
          <PageLayout.Header>
            <Box display="flex" alignItems="center">
              <Box
                as="h1"
                p={3}
              >
                Kha`s code contributions. And tweets.
              </Box>
              <Box>
                <SwitchButton />
              </Box>
            </Box>
        </PageLayout.Header>
          <PageLayout.Content>
            <Box
              p={3}
            >
              {activities.map((activity: any, idx: number) => (
                <Activity key={`activity_${idx}`} data={activity} />
              ))}
            </Box>
          </PageLayout.Content>
          <PageLayout.Footer>
            <Box as="p">
              This page has been created with the Framework{" "}
              <Link
                href="https://remix.ethereum.org/"
                target="_blank"
              >
                Remix
              </Link>
              {" "} and the Theming System{" "}
              <Link
                href="https://primer.style/"
                target="_blank"
              >
                Primer
              </Link>. The code is available on{" "}
              <Link
                href="https://github.com/khamui/micro-activity"
                target="_blank"
              >
                GitHub
              </Link>.
            </Box>
          </PageLayout.Footer>
        </PageLayout>
      </BaseStyles>
    </ThemeProvider>
  );
}

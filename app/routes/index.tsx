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
  Link,
  Heading,
  PointerBox
} from "@primer/react";

export const loader = async () => {
  const AS = new ActivitiesService()
  return await AS.loader()
};

function SwitchButton() {
  const {colorMode, setColorMode} = useTheme()
  return (
    <ToggleSwitch
      size="small"
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
      colorMode="auto"
      preventSSRMismatch
    >
      <BaseStyles>
        <PageLayout sx={{bg: 'canvas.default'}}>
          <PageLayout.Header>
            <Box
              display="flex"
              justifyContent="flex-end"
              px={3}
              py={2}
            >
              <PointerBox
                caret="right"
                sx={{
                  p: 3,
                  m: 2,
                  bg: 'done.subtle',
                  color: 'done.fg',
                  borderWidth: 1,
                  borderColor: 'done.fg',
                  borderStyle: 'solid',
                  width: '30%'
                }}
              >
                Switch theme between bright and dark.
              </PointerBox>
              <SwitchButton />
            </Box>
            <Box p={3}>
              <Heading
                as="h1"
              >
                Kha`s code contributions. And tweets.
              </Heading>
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
            <Box as="p" px={3}>
              Built with{" "}
              <Link
                href="https://remix.run/"
                target="_blank"
              >
                Remix
              </Link>
              {" "}and{" "}
              <Link
                href="https://primer.style/"
                target="_blank"
              >
                Primer
              </Link>. Available under MIT License on{" "}
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

import React from "react";
import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {

  const sheet = new ServerStyleSheet();
  try {
    const markup = renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        <RemixServer context={remixContext} url={request.url} />
      </StyleSheetManager>
    );
    // const styleTags = sheet.getStyleTags(); // or sheet.getStyleElement();
    // console.log('STYLE TAGS FROM SERVER', styleTags);
    responseHeaders.set("Content-Type", "text/html");
    return new Response("<!DOCTYPE html>" + markup, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  catch (error) {
    // handle error
    console.error(error);
  } 
  finally {
    sheet.seal();
  }
}

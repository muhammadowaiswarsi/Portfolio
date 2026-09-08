"use client";

import mixpanel from "mixpanel-browser";

import {
  MIXPANEL_EVENTS,
  type MixpanelEventName,
  type MixpanelEventProperties,
} from "@/lib/mixpanel-events";

export {
  MIXPANEL_EVENTS,
  type MixpanelClickEventName,
  type MixpanelEventName,
  type MixpanelEventProperties,
} from "@/lib/mixpanel-events";

const VIEW_EVENTS = new Set<MixpanelEventName>([
  MIXPANEL_EVENTS.PAGE_VIEWED,
  MIXPANEL_EVENTS.VIEWED_PROJECT,
  MIXPANEL_EVENTS.VIEWED_SERVICE,
  MIXPANEL_EVENTS.VIEWED_BLOG,
  MIXPANEL_EVENTS.STARTED_CONTACT_FORM,
]);

let initialized = false;
let lastViewKey = "";

function getToken(): string | undefined {
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  return token?.trim() ? token.trim() : undefined;
}

function viewKey(event: MixpanelEventName, properties?: object): string {
  if (!properties) return event;

  if ("path" in properties && typeof properties.path === "string") {
    return `${event}:${properties.path}`;
  }

  if (
    "project_slug" in properties &&
    typeof properties.project_slug === "string"
  ) {
    return `${event}:${properties.project_slug}`;
  }

  if (
    "service_slug" in properties &&
    typeof properties.service_slug === "string"
  ) {
    return `${event}:${properties.service_slug}`;
  }

  if ("blog_slug" in properties && typeof properties.blog_slug === "string") {
    return `${event}:${properties.blog_slug}`;
  }

  return event;
}

export function initMixpanel(): boolean {
  if (typeof window === "undefined") return false;
  if (initialized) return true;

  const token = getToken();
  if (!token) return false;

  mixpanel.init(token, {
    autocapture: false,
    autotrack: false,
    track_pageview: false,
    persistence: "localStorage",
    ip: true,
    batch_requests: true,
    ignore_dnt: false,
    record_sessions_percent: 0,
  });

  initialized = true;
  return true;
}

export function track<E extends MixpanelEventName>(
  event: E,
  properties?: MixpanelEventProperties[E],
): void {
  if (typeof window === "undefined") return;
  if (!initMixpanel()) return;

  if (VIEW_EVENTS.has(event)) {
    const key = viewKey(event, properties);
    if (lastViewKey === key) return;
    lastViewKey = key;
  }

  if (properties) {
    mixpanel.track(event, properties);
    return;
  }

  mixpanel.track(event);
}

export function trackPageView(path: string): void {
  track(MIXPANEL_EVENTS.PAGE_VIEWED, {
    path,
    title: document.title,
  });
}

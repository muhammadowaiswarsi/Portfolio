"use client";

import { useEffect } from "react";

import { MIXPANEL_EVENTS, track } from "@/lib/mixpanel";

type MixpanelEntityViewProps =
  | {
      event: typeof MIXPANEL_EVENTS.VIEWED_PROJECT;
      name: string;
      slug: string;
    }
  | {
      event: typeof MIXPANEL_EVENTS.VIEWED_SERVICE;
      name: string;
      slug: string;
    }
  | {
      event: typeof MIXPANEL_EVENTS.VIEWED_BLOG;
      title: string;
      slug: string;
    };

export function MixpanelEntityView(props: MixpanelEntityViewProps) {
  const slug = props.slug;
  const event = props.event;
  const label =
    props.event === MIXPANEL_EVENTS.VIEWED_BLOG ? props.title : props.name;

  useEffect(() => {
    if (!slug || !label) return;

    if (event === MIXPANEL_EVENTS.VIEWED_PROJECT) {
      track(event, {
        project_name: label,
        project_slug: slug,
      });
      return;
    }

    if (event === MIXPANEL_EVENTS.VIEWED_SERVICE) {
      track(event, {
        service_name: label,
        service_slug: slug,
      });
      return;
    }

    track(event, {
      blog_title: label,
      blog_slug: slug,
    });
  }, [event, label, slug]);

  return null;
}

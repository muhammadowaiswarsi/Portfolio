export const MIXPANEL_EVENTS = {
  PAGE_VIEWED: "Page Viewed",
  CLICKED_LETS_TALK: "Clicked Let's Talk",
  CLICKED_START_A_PROJECT: "Clicked Start a Project",
  CLICKED_VIEW_OUR_WORK: "Clicked View Our Work",
  VIEWED_PROJECT: "Viewed Project",
  VIEWED_SERVICE: "Viewed Service",
  VIEWED_BLOG: "Viewed Blog",
  STARTED_CONTACT_FORM: "Started Contact Form",
  CONTACT_FORM_SUBMITTED: "Contact Form Submitted",
} as const;

export type MixpanelEventName =
  (typeof MIXPANEL_EVENTS)[keyof typeof MIXPANEL_EVENTS];

export type MixpanelClickEventName =
  | typeof MIXPANEL_EVENTS.CLICKED_LETS_TALK
  | typeof MIXPANEL_EVENTS.CLICKED_START_A_PROJECT
  | typeof MIXPANEL_EVENTS.CLICKED_VIEW_OUR_WORK;

export type MixpanelEventProperties = {
  [MIXPANEL_EVENTS.PAGE_VIEWED]: {
    path: string;
    title?: string;
  };
  [MIXPANEL_EVENTS.CLICKED_LETS_TALK]: undefined;
  [MIXPANEL_EVENTS.CLICKED_START_A_PROJECT]: undefined;
  [MIXPANEL_EVENTS.CLICKED_VIEW_OUR_WORK]: undefined;
  [MIXPANEL_EVENTS.VIEWED_PROJECT]: {
    project_name: string;
    project_slug: string;
  };
  [MIXPANEL_EVENTS.VIEWED_SERVICE]: {
    service_name: string;
    service_slug: string;
  };
  [MIXPANEL_EVENTS.VIEWED_BLOG]: {
    blog_title: string;
    blog_slug: string;
  };
  [MIXPANEL_EVENTS.STARTED_CONTACT_FORM]: undefined;
  [MIXPANEL_EVENTS.CONTACT_FORM_SUBMITTED]: undefined;
};

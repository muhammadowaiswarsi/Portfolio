const INFO_QUERY =
  /^(hi|hello|hey|thanks|thank you|what(?:'s| is| are)? (?:your |the )?(?:services|projects|portfolio|technologies|tech stack|process|blogs?|articles?)|tell me about (?:your )?(?:services|projects|portfolio|company|technologies)|how (?:does|do) (?:the )?process|who (?:are|is) (?:you|computing yard))\b/i;

const LEAD_INTENT =
  /\b(?:i (?:want|need|would like|'d like) (?:to )?(?:build|make|create|start|hire|discuss|get)|i need (?:a|an)\b|need(?:s)? (?:a|an) (?:new )?(?:website|web app|mobile app|app|chatbot|e-?commerce|store|quote)|hire you|work with (?:you|computing yard)|get (?:a )?quote|request a quote|discuss (?:a |my )?project|start a project|looking (?:for|to build)|can you (?:build|make|create|develop) .{0,60}\b(?:for (?:me|us|my|our)|my (?:company|business|startup)))\b/i;

const CANCEL_INTENT =
  /\b(?:never mind|nevermind|forget it|i(?: actually)? (?:don(?:'t|’t)|do not) need|not interested|cancel(?: that)?|stop (?:this|the lead)|i changed my mind)\b/i;

const CONFIRM_INTENT =
  /^(?:yes|yeah|yep|sure|ok|okay|please send(?: it)?|send it|go ahead|confirm(?: it)?|try again|that(?:'s| is) (?:correct|right)|you can send(?: it)?)\b/i;

const REJECT_SEND =
  /^(?:no|nope|not now|don(?:'t|’t) send|do not send|not yet)\b/i;

export function isInformationalQuery(message: string) {
  const value = message.trim();
  if (!value) return false;
  if (LEAD_INTENT.test(value)) return false;
  return INFO_QUERY.test(value);
}

export function detectLeadIntent(message: string) {
  const value = message.trim();
  if (!value || isInformationalQuery(value)) return false;
  return LEAD_INTENT.test(value);
}

export function detectLeadCancel(message: string) {
  return CANCEL_INTENT.test(message.trim());
}

export function detectLeadConfirm(message: string) {
  return CONFIRM_INTENT.test(message.trim());
}

export function detectLeadReject(message: string) {
  return REJECT_SEND.test(message.trim());
}

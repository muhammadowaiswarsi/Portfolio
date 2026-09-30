export const OFF_TOPIC_REPLY =
  "I can only help with Computing Yard — our services, projects, technologies, and starting a project. I don't handle translations or unrelated questions. What would you like to know about our work?";

const GREETING =
  /^(hi|hello|hey|howdy|thanks|thank you|good morning|good afternoon|good evening|yo|assalam[oa] ?alaikum|salam)[\s!.?]*$/i;

const OFF_TOPIC =
  /\b(translate|translation|translator|meaning in english|into english|weather|recipe|joke|lyrics|homework|capital of|who (?:is|won) the president|write (?:me )?(?:a |an )?(?:poem|essay|story|song)|solve this (?:math|equation)|cricket score|movie recommend)/i;

const OFF_TOPIC_ONLY =
  /^(pagal|idiot|stupid|wtf|lol)[\s!.?]*$/i;

export function isGreeting(message: string) {
  return GREETING.test(message.trim());
}

export function isOffTopicMessage(message: string) {
  const value = message.trim();
  if (!value) return false;
  if (isGreeting(value)) return false;
  if (OFF_TOPIC.test(value)) return true;
  if (value.length <= 24 && OFF_TOPIC_ONLY.test(value)) return true;
  return false;
}

export const isHtmlInputElement = (
  o: EventTarget | null
): o is HTMLInputElement => {
  return o != null && "value" in o;
};

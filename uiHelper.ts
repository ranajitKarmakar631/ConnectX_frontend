export const convertObjectNameToString = (
  name:
    | { firstName?: string; first?: string; lastName?: string; last?: string }
    | null
    | undefined,
): string => {
  if (!name) return "Unknown";

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const firstName = name.firstName || name.first;
  const lastName = name.lastName || name.last;

  if (!firstName && !lastName) return "Unknown";

  return [firstName, lastName]
    .filter((s): s is string => !!s)
    .map(capitalize)
    .join(" ");
};

export const getInitials = (name: string | null | undefined) => {
  return (
    name
      ?.split(" ")
      ?.map((word: string) => word[0])
      ?.join("")
      ?.toUpperCase() || ""
  );
};

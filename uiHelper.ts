export const convertObjectNameToString = (name: any): string => {
  if (!name) return "Unknown";

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const firstName = name.firstName || name.first;
  const lastName = name.lastName || name.last;

  if (!firstName && !lastName) return "Unknown";

  return [firstName, lastName].filter(Boolean).map(capitalize).join(" ");
};

export const getInitials = (name: string) => {
  return name?.split(" ")?.map(word => word[0])?.join("")?.toUpperCase();
};
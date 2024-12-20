import { Timestamp } from "firebase/firestore";

export const convertTimestampToDate = (timestamp: Timestamp): string => {
  const date = timestamp.toDate();
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const convertTimestampToDetailedDate = (
  timestamp: Timestamp
): string => {
  const date = timestamp.toDate();
  return date.toLocaleString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const convertTimestampToMinimalDate = (timestamp: Timestamp): string => {
  const date = timestamp.toDate();
  return date.toLocaleString("es-ES", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
  });
};

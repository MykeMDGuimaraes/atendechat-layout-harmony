import moment from "moment";

export const useDate = () => {
  const dateToClient = (date: string | Date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  const formatTime = (minutes: number) => {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  };

  const getDateAndDifDays = (dueDate: string | Date) => {
    const now = moment();
    const due = moment(dueDate);
    const difData = due.diff(now, "days");
    
    return { difData, dueDate };
  };

  return { dateToClient, formatTime, getDateAndDifDays };
};

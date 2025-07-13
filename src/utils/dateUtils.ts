export const formatDate = (date: Date): string => {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayOfWeek = today.getDay();

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[dayOfWeek];

  return {
    fullDate: `${year}년 ${month}월 ${date}일`,
    dayName: dayName,
    date: date,
    month: month,
    year: year,
  };
};

// 날짜가 특정 주기 설정에 따라 다음 예정일을 반환
export const getNextDueDate = (
  lastCompleted: Date | undefined,
  createdAt: Date,
  frequency: any // FrequencySettings 타입 import 루프 방지, 실제 사용처에서 타입 지정
): string => {
  // frequency가 undefined이거나 null인 경우 처리
  if (!frequency) {
    return "알 수 없음";
  }

  const baseDate = lastCompleted
    ? new Date(lastCompleted)
    : new Date(createdAt);
  let nextDue = new Date(baseDate);

  switch (frequency.type) {
    case "daily":
      nextDue.setDate(baseDate.getDate() + 1);
      break;
    case "weekly":
      nextDue.setDate(baseDate.getDate() + 7);
      break;
    case "biweekly":
      nextDue.setDate(baseDate.getDate() + 14);
      break;
    case "monthly":
      nextDue.setMonth(baseDate.getMonth() + 1);
      break;
    case "custom":
      if (frequency.customDays) {
        nextDue.setDate(baseDate.getDate() + frequency.customDays);
      }
      break;
  }

  return nextDue.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

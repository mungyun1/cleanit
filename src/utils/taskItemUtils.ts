import { FrequencySettings, ChecklistItem } from "../types";

export const getFrequencyText = (frequency: FrequencySettings) => {
  const dayNames = {
    monday: "월요일",
    tuesday: "화요일",
    wednesday: "수요일",
    thursday: "목요일",
    friday: "금요일",
    saturday: "토요일",
    sunday: "일요일",
  };

  switch (frequency.type) {
    case "daily":
      return "매일";
    case "weekly":
      if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
        const dayLabels = frequency.daysOfWeek
          .map((day) => dayNames[day])
          .join(", ");
        return `매주 ${dayLabels}`;
      }
      return "매주";
    case "biweekly":
      if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
        const dayLabels = frequency.daysOfWeek
          .map((day) => dayNames[day])
          .join(", ");
        return `격주 ${dayLabels}`;
      }
      return "격주";
    case "monthly":
      return "월 1회";
    case "custom":
      return frequency.customDays
        ? `${frequency.customDays}일마다`
        : "사용자 정의";
    default:
      return "알 수 없음";
  }
};

export const getSpaceColor = (space: string, colors: any) => {
  switch (space) {
    case "거실":
      return colors.livingRoom;
    case "주방":
      return colors.kitchen;
    case "욕실":
      return colors.bathroom;
    case "화장실":
      return colors.toilet;
    case "침실":
      return colors.bedroom;
    default:
      return colors.common;
  }
};

export const getLaundryTypeColor = (laundryType: string) => {
  switch (laundryType) {
    case "whites":
      return "#E3F2FD"; // 연한 파란색
    case "colors":
      return "#F3E5F5"; // 연한 보라색
    case "delicates":
      return "#FFF3E0"; // 연한 주황색
    case "bedding":
      return "#E8F5E8"; // 연한 초록색
    case "towels":
      return "#FCE4EC"; // 연한 분홍색
    default:
      return "#F5F5F5";
  }
};

export const getLaundryTypeText = (laundryType: string) => {
  switch (laundryType) {
    case "whites":
      return "흰 옷";
    case "colors":
      return "색 옷";
    case "delicates":
      return "섬세한 옷";
    case "bedding":
      return "침구";
    case "towels":
      return "수건";
    default:
      return laundryType;
  }
};

export const getLabelColor = (label: string, colors: any) => {
  switch (label) {
    case "청소":
      return colors.primary + "20"; // 연한 primary 색상
    case "빨래":
      return colors.secondary + "20"; // 연한 secondary 색상
    case "반려동물":
      return "#E8F5E8"; // 연한 초록색
    default:
      return colors.common + "20";
  }
};

// 체크리스트 상위 3개 항목을 description으로 생성하는 함수
export const generateDescriptionFromChecklist = (
  checklistItems: ChecklistItem[]
) => {
  if (!checklistItems || checklistItems.length === 0) {
    return "체크리스트가 없습니다";
  }

  const top3Items = checklistItems.slice(0, 3);
  const itemTitles = top3Items.map((item) => item.title);

  if (checklistItems.length <= 3) {
    return itemTitles.join(" • ");
  } else {
    return `${itemTitles.join(" • ")} 등`;
  }
};

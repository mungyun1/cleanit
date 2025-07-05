import { COLORS } from "../constants";

// 캘린더 목데이터 타입 정의
export interface CalendarMarkedDate {
  marked: boolean;
  dotColor: string;
  textColor: string;
  selected?: boolean;
  selectedColor?: string;
  customStyles?: {
    container?: any;
    text?: any;
  };
}

export interface CalendarMarkedDates {
  [date: string]: CalendarMarkedDate;
}

// 예정된 청소 작업 타입 정의
export interface ScheduledTask {
  id: string;
  title: string;
  description: string;
  area: string;
  priority: "low" | "medium" | "high";
  estimatedTime: number; // 분 단위
  color: string;
}

export interface ScheduledTasksByDate {
  [date: string]: ScheduledTask[];
}

// 예정된 청소 작업 데이터
export const SCHEDULED_TASKS_DATA: ScheduledTasksByDate = {
  "2025-06-15": [
    {
      id: "1",
      title: "거실 청소",
      description: "바닥 쓸기, 먼지 털기, 소파 정리",
      area: "거실",
      priority: "medium",
      estimatedTime: 30,
      color: COLORS.livingRoom,
    },
    {
      id: "1-2",
      title: "거실 창문 청소",
      description: "창문 틀 닦기, 커튼 세탁",
      area: "거실",
      priority: "low",
      estimatedTime: 20,
      color: COLORS.livingRoom,
    },
  ],
  "2025-06-18": [
    {
      id: "2",
      title: "주방 청소",
      description: "주방대 정리, 싱크 청소, 쓰레기 비우기",
      area: "주방",
      priority: "high",
      estimatedTime: 45,
      color: COLORS.kitchen,
    },
    {
      id: "2-2",
      title: "주방 보관함 정리",
      description: "식료품 정리, 유통기한 확인",
      area: "주방",
      priority: "medium",
      estimatedTime: 25,
      color: COLORS.kitchen,
    },
    {
      id: "2-3",
      title: "가스레인지 청소",
      description: "가스레인지 분해 청소, 후드 필터 교체",
      area: "주방",
      priority: "high",
      estimatedTime: 35,
      color: COLORS.kitchen,
    },
  ],
  "2025-06-20": [
    {
      id: "3",
      title: "욕실 청소",
      description: "욕조 청소, 변기 청소, 타일 닦기",
      area: "욕실",
      priority: "high",
      estimatedTime: 40,
      color: COLORS.bathroom,
    },
  ],
  "2025-06-22": [
    {
      id: "4",
      title: "침실 정리",
      description: "침대 정리, 옷장 정리, 먼지 털기",
      area: "침실",
      priority: "medium",
      estimatedTime: 25,
      color: COLORS.bedroom,
    },
    {
      id: "4-2",
      title: "침실 침구 세탁",
      description: "이불, 베개커버, 매트리스 커버 세탁",
      area: "침실",
      priority: "medium",
      estimatedTime: 30,
      color: COLORS.bedroom,
    },
  ],
  "2025-06-25": [
    {
      id: "5",
      title: "공용 공간 청소",
      description: "복도 청소, 현관 정리, 창문 닦기",
      area: "공용",
      priority: "low",
      estimatedTime: 35,
      color: COLORS.common,
    },
    {
      id: "5-2",
      title: "발코니 청소",
      description: "발코니 바닥 청소, 화분 정리, 빨래 건조대 정리",
      area: "공용",
      priority: "low",
      estimatedTime: 20,
      color: COLORS.common,
    },
  ],
  "2025-06-28": [
    {
      id: "6",
      title: "거실 대청소",
      description: "가구 이동, 바닥 닦기, 창문 청소",
      area: "거실",
      priority: "medium",
      estimatedTime: 60,
      color: COLORS.livingRoom,
    },
  ],
  "2025-06-30": [
    {
      id: "7",
      title: "주방 정리",
      description: "냉장고 정리, 조리도구 정리, 가스레인지 청소",
      area: "주방",
      priority: "medium",
      estimatedTime: 50,
      color: COLORS.kitchen,
    },
  ],
  "2025-07-02": [
    {
      id: "8",
      title: "욕실 소독",
      description: "소독제 사용, 곰팡이 제거, 환기",
      area: "욕실",
      priority: "high",
      estimatedTime: 45,
      color: COLORS.bathroom,
    },
    {
      id: "8-2",
      title: "욕실 타일 청소",
      description: "타일 줄눈 청소, 곰팡이 제거, 실리콘 교체",
      area: "욕실",
      priority: "medium",
      estimatedTime: 30,
      color: COLORS.bathroom,
    },
  ],
  "2025-07-05": [
    {
      id: "9",
      title: "침실 대청소",
      description: "침대 시트 교체, 옷장 정리, 먼지 제거",
      area: "침실",
      priority: "medium",
      estimatedTime: 40,
      color: COLORS.bedroom,
    },
  ],
  "2025-07-08": [
    {
      id: "10",
      title: "전체 정리",
      description: "전체 공간 점검, 불필요한 물건 정리",
      area: "공용",
      priority: "low",
      estimatedTime: 90,
      color: COLORS.common,
    },
  ],
  "2025-07-12": [
    {
      id: "11",
      title: "거실 창문 청소",
      description: "창문 틀 닦기, 커튼 세탁, 블라인드 청소",
      area: "거실",
      priority: "medium",
      estimatedTime: 35,
      color: COLORS.livingRoom,
    },
  ],
  "2025-07-15": [
    {
      id: "12",
      title: "주방 대청소",
      description: "가스레인지 분해 청소, 후드 필터 교체",
      area: "주방",
      priority: "high",
      estimatedTime: 70,
      color: COLORS.kitchen,
    },
    {
      id: "12-2",
      title: "주방 냉장고 정리",
      description: "냉장고 내부 청소, 음식물 정리, 제빙기 청소",
      area: "주방",
      priority: "high",
      estimatedTime: 40,
      color: COLORS.kitchen,
    },
  ],
  "2025-07-18": [
    {
      id: "13",
      title: "욕실 타일 청소",
      description: "타일 줄눈 청소, 곰팡이 제거, 실리콘 교체",
      area: "욕실",
      priority: "medium",
      estimatedTime: 55,
      color: COLORS.bathroom,
    },
  ],
  "2025-07-22": [
    {
      id: "14",
      title: "침실 옷장 정리",
      description: "계절별 옷 정리, 불필요한 옷 정리",
      area: "침실",
      priority: "low",
      estimatedTime: 45,
      color: COLORS.bedroom,
    },
  ],
  "2025-07-25": [
    {
      id: "15",
      title: "현관 대청소",
      description: "신발장 정리, 우산꽂이 청소, 매트 세탁",
      area: "공용",
      priority: "medium",
      estimatedTime: 30,
      color: COLORS.common,
    },
  ],
  "2025-08-01": [
    {
      id: "16",
      title: "거실 가구 청소",
      description: "소파 청소, 테이블 닦기, 장식품 정리",
      area: "거실",
      priority: "medium",
      estimatedTime: 40,
      color: COLORS.livingRoom,
    },
    {
      id: "16-2",
      title: "거실 에어컨 청소",
      description: "에어컨 필터 교체, 외부기 청소",
      area: "거실",
      priority: "medium",
      estimatedTime: 25,
      color: COLORS.livingRoom,
    },
  ],
  "2025-08-05": [
    {
      id: "17",
      title: "주방 보관함 정리",
      description: "식료품 정리, 유통기한 확인, 보관함 청소",
      area: "주방",
      priority: "high",
      estimatedTime: 60,
      color: COLORS.kitchen,
    },
  ],
  "2025-08-08": [
    {
      id: "18",
      title: "욕실 대청소",
      description: "욕조 소독, 변기 청소, 타일 광택",
      area: "욕실",
      priority: "high",
      estimatedTime: 50,
      color: COLORS.bathroom,
    },
    {
      id: "18-2",
      title: "욕실 환기구 청소",
      description: "환기구 필터 교체, 배수구 청소",
      area: "욕실",
      priority: "medium",
      estimatedTime: 20,
      color: COLORS.bathroom,
    },
  ],
  "2025-08-12": [
    {
      id: "19",
      title: "침실 침구 세탁",
      description: "이불, 베개커버, 매트리스 커버 세탁",
      area: "침실",
      priority: "medium",
      estimatedTime: 35,
      color: COLORS.bedroom,
    },
  ],
  "2025-08-15": [
    {
      id: "20",
      title: "발코니 청소",
      description: "발코니 바닥 청소, 화분 정리, 빨래 건조대 정리",
      area: "공용",
      priority: "low",
      estimatedTime: 25,
      color: COLORS.common,
    },
  ],
  "2025-08-20": [
    {
      id: "21",
      title: "거실 에어컨 청소",
      description: "에어컨 필터 교체, 외부기 청소",
      area: "거실",
      priority: "medium",
      estimatedTime: 45,
      color: COLORS.livingRoom,
    },
  ],
  "2025-08-25": [
    {
      id: "22",
      title: "주방 냉장고 정리",
      description: "냉장고 내부 청소, 음식물 정리, 제빙기 청소",
      area: "주방",
      priority: "high",
      estimatedTime: 55,
      color: COLORS.kitchen,
    },
  ],
  "2025-08-28": [
    {
      id: "23",
      title: "욕실 환기구 청소",
      description: "환기구 필터 교체, 배수구 청소",
      area: "욕실",
      priority: "medium",
      estimatedTime: 30,
      color: COLORS.bathroom,
    },
  ],
  "2025-08-30": [
    {
      id: "24",
      title: "전체 정리 및 점검",
      description: "전체 공간 점검, 정리 상태 확인",
      area: "공용",
      priority: "low",
      estimatedTime: 60,
      color: COLORS.common,
    },
  ],
};

// 통계 목데이터
export interface MonthlyStats {
  completedTasks: number;
  incompleteTasks: number;
  completionRate: string;
  consecutiveDays: number;
}

export const MONTHLY_STATS_MOCK: MonthlyStats = {
  completedTasks: 15,
  incompleteTasks: 8,
  completionRate: "65%",
  consecutiveDays: 5,
};

// 공간별 범례 데이터
export interface LegendItem {
  color: string;
  label: string;
}

export const LEGEND_DATA: LegendItem[] = [
  { color: COLORS.livingRoom, label: "거실" },
  { color: COLORS.kitchen, label: "주방" },
  { color: COLORS.bathroom, label: "욕실" },
  { color: COLORS.toilet, label: "화장실" },
  { color: COLORS.bedroom, label: "침실" },
  { color: COLORS.common, label: "공용" },
];

// 캘린더 마킹 데이터 생성 함수
export const generateCalendarMarkedDates = (): CalendarMarkedDates => {
  const markedDates: CalendarMarkedDates = {};

  Object.keys(SCHEDULED_TASKS_DATA).forEach((date) => {
    const tasks = SCHEDULED_TASKS_DATA[date];
    if (tasks.length > 0) {
      // 첫 번째 작업의 색상을 사용
      markedDates[date] = {
        marked: true,
        dotColor: tasks[0].color,
        textColor: COLORS.onBackground,
        // 동그라미 배경을 위한 추가 스타일
        customStyles: {
          container: {
            backgroundColor: tasks[0].color + "20", // 투명도 20%
            borderRadius: 20,
            width: 36,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
          },
          text: {
            color: COLORS.onBackground,
            fontWeight: "600",
          },
        },
      };
    }
  });

  return markedDates;
};

// 캘린더 샘플 데이터
export const CALENDAR_MOCK_DATA: CalendarMarkedDates =
  generateCalendarMarkedDates();

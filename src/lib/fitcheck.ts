export const FITCHECK_PREVIEW_DISCLAIMER =
  "LoadIQ does not guarantee revenue, profit, income, freight availability, rate improvement, or business success. Estimates are based on user-provided information and scenario-based analysis. Actual results may vary.";

export const BUSINESS_TYPE_OPTIONS = [
  { value: "owner_operator", label: "Owner-operator" },
  { value: "small_fleet", label: "Small fleet" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "other", label: "Other" },
] as const;

export const EQUIPMENT_TYPE_OPTIONS = [
  "Dry van",
  "Reefer",
  "Flatbed",
  "Step deck",
  "Power-only",
  "Box truck",
  "Other",
] as const;

export const BIGGEST_PROBLEM_OPTIONS = [
  "Too much deadhead",
  "Rates are too low",
  "Fuel costs",
  "Inconsistent loads",
  "Broker problems",
  "Detention/wait time",
  "Poor lane planning",
  "Not sure what loads are actually profitable",
  "Other",
] as const;

export type FitCheckPreviewInput = {
  businessType: string;
  truckCount: number;
  equipmentType: string;
  monthlyGrossRevenue: number;
  monthlyBusinessOverhead: number;
  currentOperatorIncome: number;
  targetOperatorIncome: number;
  desiredBusinessCushion: number;
  biggestCurrentProblem: string;
};

export type FitCheckPreviewResult = {
  monthlyAvailableBeforeOperator: number;
  currentGapToTarget: number;
  totalTargetNeed: number;
  businessHealthGap: number;
  fitPreviewStatus:
    | "Likely fit"
    | "Possible fit"
    | "Needs more data"
    | "Not enough information yet";
};

export const defaultFitCheckPreviewInput: FitCheckPreviewInput = {
  businessType: "owner_operator",
  truckCount: 1,
  equipmentType: "Dry van",
  monthlyGrossRevenue: 0,
  monthlyBusinessOverhead: 0,
  currentOperatorIncome: 0,
  targetOperatorIncome: 0,
  desiredBusinessCushion: 0,
  biggestCurrentProblem: "",
};

function safeNumber(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function calculateFitCheckPreview(
  input: FitCheckPreviewInput
): FitCheckPreviewResult {
  const monthlyAvailableBeforeOperator =
    safeNumber(input.monthlyGrossRevenue) - safeNumber(input.monthlyBusinessOverhead);
  const currentGapToTarget =
    safeNumber(input.targetOperatorIncome) - safeNumber(input.currentOperatorIncome);
  const totalTargetNeed =
    safeNumber(input.targetOperatorIncome) + safeNumber(input.desiredBusinessCushion);
  const businessHealthGap = totalTargetNeed - monthlyAvailableBeforeOperator;
  const hasCoreData =
    input.monthlyGrossRevenue > 0 &&
    input.monthlyBusinessOverhead > 0 &&
    input.targetOperatorIncome > 0;
  const hasPartialData =
    input.monthlyGrossRevenue > 0 &&
    (input.monthlyBusinessOverhead > 0 || input.targetOperatorIncome > 0);

  const fitPreviewStatus = !hasPartialData
    ? "Not enough information yet"
    : !hasCoreData
      ? "Needs more data"
      : businessHealthGap > 0 ||
          currentGapToTarget > 0 ||
          input.biggestCurrentProblem === "Not sure what loads are actually profitable"
        ? "Likely fit"
        : "Possible fit";

  return {
    monthlyAvailableBeforeOperator,
    currentGapToTarget,
    totalTargetNeed,
    businessHealthGap,
    fitPreviewStatus,
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

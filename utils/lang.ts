interface LanguageConfig {
  lang: string;
  baseUrl: string;
  menuUrl: string;
  searchUrl: string;
  otherSizes: string;
  caloriesPrefix: string;
  measurementRegex: {
    calories: RegExp;
    carb: RegExp;
    fat: RegExp;
    protein: RegExp;
  };
}

export const lang: LanguageConfig[] = [{
  lang: "ko",
  baseUrl: "https://www.fatsecret.kr",
  menuUrl: "https://www.fatsecret.kr/칼로리-영양소",
  searchUrl: "https://www.fatsecret.kr/칼로리-영양소/search",
  otherSizes:  "다른 크기:" || "영양 정보",
  caloriesPrefix: "칼로리:",
  measurementRegex: {
    calories: /칼로리: |kcal/g,
    carb: /탄수화물: |g/g,
    fat: /지방: |g/g,
    protein: /단백질: |g/g,
  }
}];

export function getLang(langCode: string): LanguageConfig | null {
  const lang = lang.filter((lg) => lg.lang === langCode)[0];
  return lang || null;
}

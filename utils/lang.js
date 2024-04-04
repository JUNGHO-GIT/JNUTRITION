export const lang = [{
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

export function getLang(langCode) {
  return lang.filter((lg) => lg.lang === langCode)[0] || null;
}

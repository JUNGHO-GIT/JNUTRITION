import { lang } from "../utils/lang";

export default async (_request, response) => {
  response.json({
    supported_lang: lang.map((l) => ({
      lang: l.lang,
      url: l.searchUrl,
    })),
    repo: "https://github.com/JUNGHO-GIT/JNUTRITION",
    credits: ["fatsecret.com", "vercel.sh"],
  });
};


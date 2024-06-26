import cheerio from "cheerio";
import { fetchHTML } from "../utils/fetch.ts";
import { getLang } from "../utils/lang.ts";

// ------------------------------------------------------------------------------------------------>
export default async (request, response) => {
  const langConfig = getLang(String(request.query.lang));
  const detailUrl = request.query.url;

  if (!detailUrl) {
    response.json({ error: 'please provide detailLink on search' });
    return;
  }
  if (!langConfig) {
    response.json({ error: `${request.query.lang} are not supported` });
    return;
  }

  const html = await fetchHTML(`${langConfig.baseUrl}${detailUrl}`, {});
  const $ = cheerio.load(html);

  // 적절한 셀렉터로 해당 요소를 선택하십시오.
  const title = $("selector-for-title").text();
  const serving = $("selector-for-serving").text();
  const calories = parseInt($("selector-for-calories").text());
  const fat = parseFloat($("selector-for-fat").text());
  const carbo = parseFloat($("selector-for-carbo").text());
  const protein = parseFloat($("selector-for-protein").text());

  const fatDetail = {
    title,
    serving,
    calories,
    fat,
    carbo,
    protein
  };

  response.setHeader("Cache-Control", "s-maxage=100, stale-while-revalidate");
  response.json(fatDetail);
};
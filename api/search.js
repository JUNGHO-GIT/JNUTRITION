import cheerio from "cheerio";
import { fetchHTML } from "../utils/fetch";
import { getLang } from "../utils/lang";

export default async (request, response) => {
  const url = request.headers["x-forwarded-host"];
  const proto = request.headers["x-forwarded-proto"];
  const query = request.query.query;
  const page = +request.query.page || 0;
  const langConfig = getLang(String(request.query.lang));
  if (!langConfig) {
    response.json({ error: `${request.query.lang} are not supported` });
    return;
  }

  if (!query) {
    response.json({ error: "Please insert a query, q=??" });
    return;
  }

  const html = await fetchHTML(langConfig.searchUrl, {
    q: query,
    pg: page,
  });
  const $ = cheerio.load(html);
  const items = [];

  $("table.generic.searchResult td.borderBottom").each((_, elem) => {
    const element = $(elem);

    const title = element.find("a.prominent");
    const brand = element.find("a.brand");

    const linkTitle = title.text();
    const linkBrand = brand.text();

    const detailLink = title.attr("href");
    const normalizeText = element
      .find("div.smallText.greyText.greyLink")
      .text()
      .replace(/(\r\n|\n|\r\t|\t|\r)/gm, "");

    const splitSection = normalizeText.split(langConfig.otherSizes);
    const splitGeneralInfoString = splitSection[0].split("-");
    const generalInfo = splitGeneralInfoString[1].split("|");

    const calories =
      parseFloat(
        generalInfo[0]
          .replace(langConfig.measurementRegex.calories, "")
          .replace(",", ".")
          .trim()
      ) || 0;

    const fat =
      parseFloat(
        generalInfo[1]
          .replace(langConfig.measurementRegex.fat, "")
          .replace(",", ".")
          .trim()
      ) || 0;

    const carb =
      parseFloat(
        generalInfo[2]
          .replace(langConfig.measurementRegex.carb, "")
          .replace(",", ".")
          .trim()
      ) || 0;

    const protein =
      parseFloat(
        generalInfo[3]
          .replace(langConfig.measurementRegex.protein, "")
          .replace("영양 정보", "")
          .replace("다른 크기:", "")
          .replace(",", ".")
          .trim()
      ) || 0;

    const servingValue = splitGeneralInfoString[0]
      .replace(",", ".")
      .replace("   ", "")
      .replace(" g ", "g")
      .replace(" g", "g")
      .replace("g ", "g")
      .replace(" ( ", "(")
      .replace(" (", "(")
      .replace(") ", ")")
      .replace(" ' ", "'")
      .replace(" '", "'")
      .replace("' ", "'")
      .replace("당 '", "'")
      .replace(" 당 ", "")
      .replace("당 ", "")
      .replace(" 당", "")
      .replace(" 인 ", "인")
      .replace(" 인", "인")
      .replace("인 ", "인")
      .trim();

    items.push({
      title: linkTitle,
      brand: linkBrand,
      calories,
      fat,
      carb,
      protein,
      serving: servingValue,
      detailLink: `${proto}://${url}/api/${
        langConfig.lang
      }/detail?url=${encodeURIComponent(detailLink || "")}`,
    });
  });

  const searchSum = $(".searchResultSummary").text().split(" ");
  const searchSumText = $(".searchResultSummary").text();
  const total = parseInt(searchSumText.replace(/\D/g, ""));
  const endOfPage = total === parseInt(searchSum[2]);
  const startOfPage = page < 1;
  const next = endOfPage ? 0 : page + 1;
  const prev = startOfPage ? 0 : page - 1;
  const data = {
    items,
    total,
    prev,
    next,
    current: page
  };
  response.setHeader("Cache-Control", "s-maxage=100, stale-while-revalidate");
  response.json(data);
};

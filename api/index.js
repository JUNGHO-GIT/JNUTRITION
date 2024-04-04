import cheerio from "cheerio";
import { fetchHTML } from "../utils/fetch.ts";
import { getLang } from "../utils/lang.ts";

export default async (request, response) => {
  const langConfig = getLang(String(request.query.lang));
  if (!langConfig) {
    response.json({ error: `${request.query.lang} are not supported` });
    return;
  }
  const html = await fetchHTML(langConfig.menuUrl, {});
  const $ = cheerio.load(html);
  const menus = [];
  $("table.generic.common td.borderBottom").each((_, elem) => {
    const element = $(elem).children(".details");
    const title = element.find("a.prominent").text();
    const desc = element.find(".smallText").text().replace("lagi", "");
    const image = $(elem).find("a > img").attr("src");
    const menu = {
      title,
      desc,
      image,
    };
    menus.push(menu);
  });
  response.setHeader("Cache-Control", "s-maxage=5, stale-while-revalidate");
  response.json(menus);
};

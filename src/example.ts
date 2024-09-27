import * as cheerio from "cheerio";
import axios from "axios";
import iconv from 'iconv-lite';

const target = `https://mukawa-spirit.com/`;

async function getHTML(URL: string, decodingCharset?: string) {
    const options: any = {};

    if (decodingCharset) {
        options.responseType = "arraybuffer";
    }

    const html = await axios.get(URL, options);
    const data = decodingCharset ? iconv.decode(html.data, decodingCharset) : html.data;
    
    return cheerio.load(data);
}

async function getItems() {
    const $ = await getHTML(target, "euc-jp");
    
    const list = $("section.arrival ul.list-product");
    const items = list.find("li.list-product-item");
    const datas = items.map((_, item) => {
        const $ = cheerio.load(item, null, true);
        const data = {
            thumbnail: $("div.list-product-item__thumbnail img").attr("src"),
            title: $("div.list-product-item__ttl").text(),
            price: $("div.list-product-item__price").text(),
            memo: $("div.list-product-item__memo").text(),
        }
        return data;
    })
    console.log(...datas);
    return [...datas];
}

getItems();

const cheerio = require("cheerio");
const request = require('async-request');
const tr = require('tor-request');

class CrunchBaseScraper {

    async requestPage(url, callback) {
        //return await request(url);
        tr.request(url, callback);
    }

    loadPage(page) {
        return cheerio.load(page.body);
    }

    scrapeClassHrefs($, classString) {
        // want all hrefs for elements with given class string (cb-link ng-star-inserted)
        return $(classString).map((index, value) => $(value).attr('href'));
    }

    findCategoryHrefs($) {
        return $("a[href*='/search/organizations/field/organizations/categories/']")
            .map((index, value) => $(value).attr('title'));
    }

    findLocationHrefs($) {
        return $("a[href*='/search/organizations/field/organizations/location_identifiers/']")
        .map((index, value) => $(value).attr('title'));
    }

    filterHRefs(hrefArray, regex) {
        // probs gonna filter where href starts with '/search/organizations/field/organizations/categories/'
        return hrefArray.filter((href) => regex.test(href))
    }

    trimHrefs(hrefArray, regex) {
        return hrefArray.map((href) => href.replace(regex, ''));
    }

    findHRefs($) {
        return this.scrapeClassHrefs($, '.cb-link.ng-star-inserted');
    }

    findCategories($) {
        let hrefs = this.filterHRefs($);

        let hrefRegex = new RegExp("^/search/organizations/field/organizations/categories/")
        let categoryHrefs = this.filterHRefs(hrefs.toArray(), hrefRegex);
        let categories = this.trimHrefs(categoryHrefs, hrefRegex);

        return categories;
    }

    findLocations($) {
        let hrefs = this.findHRefs($);

        let hrefRegex = new RegExp("^/search/organizations/field/organizations/location_identifiers/");
        let hrefObjects = hrefs.map((obj) => hrefRegex.test($(obj).att('href')));
        return hrefObjects.map((obj) => $(obj).attr('title')).toArray();
    }

    async scrapePage(url, callback) {
        await this.requestPage({
            url: url,
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
                'referer': 'https://www.google.co.uk/'
            }
        },
        (err, res, body) => {
            if(err) {
                console.log(err);
                return;
            }
            console.log(`Response Code: ${res.statusCode}`);
            if(res.statusCode == 200) {
                let $ = this.loadPage(body.html());
                let categories = this.findCategoryHrefs($);
                let locations = this.findLocationHrefs($);
                let information = {
                    categories : categories.toArray(),
                    locations  : locations.toArray()
                }
                console.log(information);
                callback(information);
            }
            return;
        });
    }
}



module.exports = CrunchBaseScraper
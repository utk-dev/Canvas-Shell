var metaForm = id("metaForm");
var metaTitle = id("metaTitle");
var metaSummary = id("metaSummary");
var metaPrice = id("metaPrice");
var output = id("generatedJson");
var DATA = { meta: {}, sections: [] };
function initData() {
    DATA = { meta: {}, sections: [] };
}
function generateMetaData() {
    DATA.meta = {
        title: metaTitle.value,
        summary: metaSummary.value,
        price: parseFloat(metaPrice.value)
    };
}
var CompiledLink = /** @class */ (function () {
    function CompiledLink() {
    }
    return CompiledLink;
}());
;
var CompiledSection = /** @class */ (function () {
    function CompiledSection() {
    }
    return CompiledSection;
}());
;
function generateSections() {
    var objSections = new Array();
    var objLinks = new Array();
    var SourceList = new Map();
    for (var _i = 0, eventManager_1 = eventManager; _i < eventManager_1.length; _i++) {
        var item = eventManager_1[_i];
        if (item && item instanceof CSection) {
            objSections.push(item);
            if (item.has_source)
                SourceList.set(item.source, item.eventId);
        }
        else if (item && item instanceof CLink) {
            objLinks.push(item);
        }
    }
    for (var _a = 0, objSections_1 = objSections; _a < objSections_1.length; _a++) {
        var sec = objSections_1[_a];
        var comSection = new CompiledSection();
        comSection.is_starting = !sec.has_source;
        comSection.is_ending = (sec.no_of_sinks === 0);
        comSection.position = sec.eventId.toString();
        comSection.text = sec.storySection.text;
        comSection.links = new Array();
        for (var _b = 0, objLinks_1 = objLinks; _b < objLinks_1.length; _b++) {
            var lin = objLinks_1[_b];
            if (sec.sink.includes(lin.storyLink.from)) {
                comSection.links.push({
                    to: SourceList.get(lin.storyLink.to).toString(),
                    button: lin.storyLink.button
                });
            }
        }
        DATA.sections.push(comSection);
    }
}
function displayJson() {
    var val = JSON.stringify(DATA, null, "  ");
    output.value = val;
}
function generateJson() {
    initData();
    generateMetaData();
    generateSections();
    displayJson();
}

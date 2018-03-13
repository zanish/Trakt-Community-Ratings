(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['movie_score'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"rottenTomatoesResults\">\n    <div class=\"col-xs-12\">\n        <div class=\"col-xs-12 col-sm-8 tmeterPanel\">\n            <div class=\"col-xs-6 numberPanel\">\n                <div class=\"rtIcon\">\n                    <div class=\"rtIcon "
    + alias4(((helper = (helper = helpers.criticBadge || (depth0 != null ? depth0.criticBadge : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"criticBadge","hash":{},"data":data}) : helper)))
    + "\"></div>\n                    <a href=\""
    + alias4(((helper = (helper = helpers.tomatoeUrl || (depth0 != null ? depth0.tomatoeUrl : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tomatoeUrl","hash":{},"data":data}) : helper)))
    + "\" class=\"tomatoLink\"><span class=\"scoreSpan\">"
    + alias4(((helper = (helper = helpers.criticScore || (depth0 != null ? depth0.criticScore : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"criticScore","hash":{},"data":data}) : helper)))
    + "</span></a>\n                </div>\n                <div class=\"col-xs-12 statsPanel\">\n                    <div><span class=\"statsSpan\">"
    + alias4(((helper = (helper = helpers.avgCriticRating || (depth0 != null ? depth0.avgCriticRating : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"avgCriticRating","hash":{},"data":data}) : helper)))
    + "</span></div>\n                    <div><span class=\"statsSpan\">"
    + alias4(((helper = (helper = helpers.criticReivewsCount || (depth0 != null ? depth0.criticReivewsCount : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"criticReivewsCount","hash":{},"data":data}) : helper)))
    + "</span></div>\n                    <div><span class=\"tabbedStatsSpan\">"
    + alias4(((helper = (helper = helpers.freshReviewCount || (depth0 != null ? depth0.freshReviewCount : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"freshReviewCount","hash":{},"data":data}) : helper)))
    + "</span></div>\n                    <div><span class=\"tabbedStatsSpan\">"
    + alias4(((helper = (helper = helpers.rottenReviewCount || (depth0 != null ? depth0.rottenReviewCount : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rottenReviewCount","hash":{},"data":data}) : helper)))
    + "</span></div>\n                </div>\n            </div>\n            <div class=\"col-xs-6 criticPanel\"><span class=\"consensus\">"
    + alias4(((helper = (helper = helpers.consensus || (depth0 != null ? depth0.consensus : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"consensus","hash":{},"data":data}) : helper)))
    + "</span></div>\n        </div>\n        <div class=\"col-xs-12 col-sm-4 audiencePanel\">\n            <div class=\"rtIcon\">\n                <div class=\"rtIcon "
    + alias4(((helper = (helper = helpers.audiencePopcorn || (depth0 != null ? depth0.audiencePopcorn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"audiencePopcorn","hash":{},"data":data}) : helper)))
    + "\"></div>\n                <span class=\"scoreSpan\">"
    + alias4(((helper = (helper = helpers.audienceScore || (depth0 != null ? depth0.audienceScore : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"audienceScore","hash":{},"data":data}) : helper)))
    + "</span>\n            </div>\n            <div class=\"statsPanel\">\n                <div><span class=\"statsSpan\">"
    + alias4(((helper = (helper = helpers.avgUserRating || (depth0 != null ? depth0.avgUserRating : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"avgUserRating","hash":{},"data":data}) : helper)))
    + "</span></div>\n                <div><span class=\"statsSpan\">"
    + alias4(((helper = (helper = helpers.userReviewsCount || (depth0 != null ? depth0.userReviewsCount : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"userReviewsCount","hash":{},"data":data}) : helper)))
    + "</span></div>\n            </div>\n        </div>\n    </div>\n</div>\n";
},"useData":true});
})();
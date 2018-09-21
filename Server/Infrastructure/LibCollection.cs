using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Server.Infrastructure
{
    public interface ILibItem
    {
        #region Declare

        string NativeName { get; }
        string Version { get; }
        string LocalPath { get; }
        string LocalPathMin { get; }
        string CdnPath { get; }
        string CdnPathMin { get; }
        string FallbackTest { get; }
        string FallbackTestClass { get; }
        string FallbackTestProperty { get; }
        string FallbackTestValue { get; }
        string Integrity { get; }
        string IntegrityMin { get; }
        bool AppendVersion { get; }

        #endregion
    }

    public class LibItem : ILibItem
    {
        #region Declare

        public LibItem()
        {
        }

        public LibItem(string nativeName, string version)
        {
            NativeName = nativeName;
            Version = version;
        }

        public LibItem(Action<LibItem> a)
        {
            a(this);
        }

        public LibItem(string nativeName, string version, Action<LibItem> action) : this(nativeName, version)
        {
            action(this);
        }

        public string NativeName { get; set; }
        public string Version { get; set; }
        public string LocalPath { get; set; }
        public string LocalPathMin { get; set; }
        public string CdnPath { get; set; }
        public string CdnPathMin { get; set; }
        public string FallbackTest { get; set; } = "false";
        public string FallbackTestClass { get; set; }
        public string FallbackTestProperty { get; set; }
        public string FallbackTestValue { get; set; }
        public string Integrity { get; set; }
        public string IntegrityMin { get; set; }
        public bool AppendVersion { get; set; } = true;

        #endregion
    }

    public static class LibCollection
    {
        #region Declare

        private const string LIB = "/lib/";
        private const string ASPNET_CDN = @"https://ajax.aspnetcdn.com/ajax/";
        private const string CLOUDFLARE = @"https://cdnjs.cloudflare.com/ajax/libs/";
        private const string JSDELIVR = @"https://cdn.jsdelivr.net/npm/";
        private const string BOOTSTRAP = @"https://maxcdn.bootstrapcdn.com/";
        private const string JS_P = @"/js/";
        private const string CSS_P = @"/css/";

        #endregion


        private static IReadOnlyDictionary<string, ILibItem> _create()
        {
            // ReSharper disable once UseObjectOrCollectionInitializer
            var coll = new Dictionary<string, ILibItem>();


            #region CommonJLibs (modernizr,$,lodash,validate)

            coll.Add(nameof(JsModernizr), new LibItem("modernizr", "2.6.2", c =>
            {
                //https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.js

                c.FallbackTest = @"window.Modernizr";
                c.Integrity = @"sha384-42XcxIwdk4Ar3U6t6DFhzpS4MK8cEP2X9r3kSTleWRIy0Sx4eLw1XLnUo0IdA2+m";
                c.IntegrityMin = @"sha384-vEQs6vKzb8v6+GpGDCnXUQ6aa2DYtn5LTi/tA/85iEZfXN0nAYj0shvYo8ldQQ7m";

                var cdn = $"{CLOUDFLARE}{c.NativeName}/{c.Version}/{c.NativeName}";
                var local = $"{LIB}modernizr";
                c._concat(local, cdn, true);
            }));


            coll.Add(nameof(JsJquery), new LibItem("jquery", "3.2.1", c =>
            {
                //https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.js

                c.FallbackTest = @"window.jQuery";
                c.Integrity = @"sha384-p7RDedFtQzvcp0/3247fDud39nqze/MUmahi6MOWjyr3WKWaMOyqhXuCT1sM9Q+l";
                c.IntegrityMin = @"sha384-xBuQ/xzmlsLoJpyjoggmTEz8OWUFM0/RC5BsqQBDX2v5cMvDHcMakNTNrHIW2I5f";

                var cdn = $"{JSDELIVR}{c.NativeName}@{c.Version}/dist/{c.NativeName}";
                var local = $"{LIB}{c.NativeName}/dist/{c.NativeName}";
                c._concat(local, cdn, true);
            }));

            coll.Add(nameof(JsLodash), new LibItem("lodash", "4.17.4", c =>
            {
                //https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.js

                c.FallbackTest = @"!!window._";
                c.Integrity = @"sha384-ujKGVvDx4RWtxg3MjyldNrAPeZqTDFa3I7H7Gy/WiYOlh5W1WEEsLgBZvwBa2h4u";
                c.IntegrityMin = @"sha384-FwbQ7A+X0UT99MG4WBjhZHvU0lvi67zmsIYxAREyhabGDXt1x0jDiwi3xubEYDYw";

                var local = $"{LIB}{c.NativeName}/dist/{c.NativeName}";
                var cdn = $"{CLOUDFLARE}{c.NativeName}.js/{c.Version}/{c.NativeName}";
                c._concat(local, cdn, true);
            }));


            coll.Add(nameof(JsJqCookie), new LibItem("jquery.cookie", "1.4.1", c =>
            {
                //https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
                c.FallbackTest = @"!!$.cookie";
                c.Integrity = @"sha384-ch1nZWLCNJ31V+4aC8U2svT7i40Ru+O8WHeLF4Mvq4aS7VD5ciODxwuOCdkIsX86";
                c.IntegrityMin = @"sha384-tSi+YsgNwyohDGfW/VhY51IK3RKAPYDcj1sNXJ16oRAyDP++K0NCzSCUW78EMFmf";
                var local = $"{LIB}{c.NativeName}/{c.NativeName}";
                var cdn = $@"{CLOUDFLARE}jquery-cookie/{c.Version}/{c.NativeName}";
                c._concat(local, cdn, true);
            }));


            coll.Add(nameof(JsJqValidate), new LibItem("jquery.validate", "1.16.0", c =>
            {
                //https://cdn.jsdelivr.net/npm/jquery-validation@1.16.0/dist/jquery.validate.js


                c.FallbackTest = @"window.jQuery && window.jQuery.validator";
                c.Integrity = @"sha384-27cy9ErO+zYM+goh8kUC2VF1PZ7p82MYnVZ8zXPzO7chXKFAix/dPoHnke+UOTJM";
                c.IntegrityMin = @"sha384-VoqiBWkuPrBO9LiESm+GubN/lYlsaMFUVN46L4g4k9bNmY9grTBw8AQZDrhAr7bT";
                var local = $"{LIB}jquery-validation/dist/{c.NativeName}";
                var cdn = $@"{JSDELIVR}jquery-validation@{c.Version}/dist/{c.NativeName}";
                c._concat(local, cdn, true);
            }));
            coll.Add(nameof(JsJqValidateUnobtrusive), new LibItem("jquery.validation.unobtrusive", "3.2.6", c =>
            {
                //https://ajax.aspnetcdn.com/ajax/jquery.validation.unobtrusive/3.2.6/jquery.validate.unobtrusive.js

                c.FallbackTest = @"window.jQuery && window.jQuery.validator && window.jQuery.validator.unobtrusive";
                c.Integrity = @"sha384-O9lpHALSEQVJYn5dAhlSIlaaas3C2NQRRy7FnGYRPduVL5RCqsrhaX81GQ5tkf55";
                c.IntegrityMin = @"sha384-JrXK+k53HACyavUKOsL+NkmSesD2P+73eDMrbTtTk0h4RmOF8hF8apPlkp26JlyH";

                var local = $"{LIB}query-validation-unobtrusive/jquery.validate.unobtrusive";
                var cdn = $"{ASPNET_CDN}jquery.validation.unobtrusive/{c.Version}/jquery.validate.unobtrusive";
                c._concat(local, cdn, true);
            }));

            #endregion


            #region Bootstrap

            // FontAwisom

            coll.Add(nameof(CssFontAwesome), new LibItem("font-awesome", "4.7.0", c =>
            {
                //https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css

                c.FallbackTestClass = "sr-only";
                c.FallbackTestProperty = "position";
                c.FallbackTestValue = "absolute";
                //"img-rounded", "border-radius", "6px"
                c.Integrity = @"sha384-FckWOBo7yuyMS7In0aXZ0aoVvnInlnFMwCv77x9sZpFgOonQgnBj1uLwenWVtsEj";
                c.IntegrityMin = @"sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN";

                var local = $"{LIB}{c.NativeName}/css/{c.NativeName}";
                var cdn = $@"{BOOTSTRAP}{c.NativeName}/{c.Version}/css/{c.NativeName}";
                c._concat(local, cdn, false);
            }));


            // Bootstrap
            coll.Add(nameof(JsBootstrapFull), new LibItem("bootstrap", "3.3.7", c =>
            {
                //https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js

                c.FallbackTest = @"window.jQuery && window.jQuery.fn && window.jQuery.fn.modal";
                c.Integrity = @"sha384-OkuKCCwNNAv3fnqHH7lwPY3m5kkvCIUnsHbjdU7sN022wAYaQUfXkqyIZLlL0xQ/";
                c.IntegrityMin = @"sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa";

                var local = LIB + @"bootstrap-sass/assets/javascripts/bootstrap";
                var cdn = $"{BOOTSTRAP}{c.NativeName}/{c.Version}/js/{c.NativeName}";
                c._concat(local, cdn, true);
            }));
            coll.Add(nameof(CssBootstrapFull), new LibItem("bootstrap", "3.3.7", c =>
            {
                c.FallbackTestClass = "img-rounded";
                c.FallbackTestProperty = "border-radius";
                c.FallbackTestValue = "6px";
                c.Integrity = @"sha384-yzOI+AGOH+8sPS29CtL/lEWNFZ+HKVVyYxU0vjId0pMG6xn7UMDo9waPX5ImV0r6";
                c.IntegrityMin = @"sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u";

                var local = $"{LIB}bootstrap-compile/bootstrap-full";
                var cdn = $@"{BOOTSTRAP}{c.NativeName}/{c.Version}/css/{c.NativeName}";
                c._concat(local, cdn, false);
            }));
            //JsThirdParty
            coll.Add(nameof(JsThirdParty), new LibItem(c =>
            {
                c.NativeName = "third-party";
                var local = _concatDirFName(JS_P, c.NativeName);
                c._concat(local, "", true);
            }));

            #endregion


            #region malihu-custom-scrollbar-plugin

            const string malihuSbVer = "3.1.5";
            coll.Add(nameof(JsMalihuCsp), new LibItem("malihu-custom-scrollbar-plugin", malihuSbVer, c =>
            {
                //https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.js

                c.FallbackTest = @"$ && !!$.fn.mCustomScrollbar";
                c.Integrity = @"sha384-c8PYTi+wTlI/Gtx4H1LrGsuSV4JwEh6XwXiIX/qdSzQd4VknmE1kZrpwGAqmtevt";
                c.IntegrityMin = "";// @"sha384-QHPBqENOg6UKmsoXiXjrEEu2W4rJZaCHDTqIOI9JqSg6dI3chbQ+0kXAYUQLEDYn";
                //sha384-QHPBqENOg6UKmsoXiXjrEEu2W4rJZaCHDTqIOI9JqSg6dI3chbQ+0kXAYUQLEDYn

                var fName = "jquery.mCustomScrollbar";
                var local = $@"{LIB}{c.NativeName}/{fName}";
                var cdn = $@"{CLOUDFLARE}{c.NativeName}/{c.Version}/{fName}";
                c.LocalPath = local + ".js";
                c.LocalPathMin = local + ".concat.min.js";
                c.CdnPath = cdn + ".js";
                c.CdnPathMin = cdn + ".concat.min.js";
            }));

            coll.Add(nameof(CssMalihuCsp), new LibItem("malihu-custom-scrollbar-plugin", malihuSbVer, c =>
            {
                //https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.css

                c.FallbackTestClass = "mCSB_scrollTools";
                c.FallbackTestProperty = "width";
                c.FallbackTestValue = "16px";
                c.Integrity = @"sha384-CYaEEtxzTAPwgXImMFjvDG8NlVsVmTew5NzIxq4MbFYF+wIzEcbPmkEa4iWMqVN3";
                c.IntegrityMin = @"sha384-2Eef5h4vdx01fD0i6qvkDNrCPXRXiKc1D1fF12tgo1LvtNdDCWOOSJo2cgc0zivP";

                var fName = "jquery.mCustomScrollbar";
                var local = $"{LIB}{c.NativeName}/{fName}";
                var cdn = $@"{CLOUDFLARE}{c.NativeName}/{c.Version}/{fName}";
                c._concat(local, cdn, false);
            }));

            //const string malihuSbCssCdn = CLOUDFLARE + "malihu-custom-scrollbar-plugin/" + malihuSbVer + "/jquery.mCustomScrollbar.min.css";
            //var malihuSbCss = new StyleBundle("~/bundles/css/malihu-custom-scrollbar-plugin", malihuSbCssCdn);
            //malihuSbCss.IncludeFallback("~/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css", "mCSB_scrollTools",
            //    "width", "16px");
            //bundles.Add(malihuSbCss);

            #endregion


            #region My

            coll.Add(nameof(JsCommon), new LibItem(c =>
            {
                c.NativeName = "common";
                var lcoal = _concatDirFName(JS_P, c.NativeName);
                c._concat(lcoal, "", true);
            }));

            #region Site

            //js
            coll.Add(nameof(JsSite), new LibItem(c =>
            {
                c.NativeName = "site";
                var lcoal = _concatDirFName(JS_P, c.NativeName);
                c._concat(lcoal, "", true);
            }));
            //css
            coll.Add(nameof(CssSite), new LibItem(c =>
            {
                c.NativeName = "site";
                var lcoal = _concatDirFName(CSS_P, c.NativeName);
                c._concat(lcoal, "", false);
            }));


            coll.Add(nameof(JsSiteAngular), new LibItem(c =>
            {
                c.NativeName = "site-angular";
                var lcoal = _concatDirFName(JS_P, c.NativeName);
                c._concat(lcoal, "", true);
            }));

            coll.Add(nameof(JsAdminAngularCore), new LibItem(c =>
            {
                c.NativeName = "admin-angular-core";
                var lcoal = _concatDirFName(JS_P, c.NativeName);
                c._concat(lcoal, "", true);
            }));

            coll.Add(nameof(JsAdminAngularInitialize), new LibItem(c =>
            {
                c.NativeName = "admin-angular-initialize";
                var lcoal = _concatDirFName(JS_P, c.NativeName);
                c._concat(lcoal, "", true);
            }));

            coll.Add(nameof(JsAdminAngularSpace), new LibItem(c =>
            {
                c.NativeName = "admin-angular-space";
                var lcoal = _concatDirFName(JS_P, c.NativeName);
                c._concat(lcoal, "", true);
            }));

            coll.Add(nameof(JsAdminAngularStore), new LibItem(c =>
            {
                c.NativeName = "admin-angular-store";
                var lcoal = _concatDirFName(JS_P, c.NativeName);
                c._concat(lcoal, "", true);
            }));

            #endregion

            #region Game

            coll.Add(nameof(JsGame), new LibItem(c =>
            {
                c.NativeName = "game";
                var lcoal = _concatDirFName(JS_P, c.NativeName);
                c._concat(lcoal, "", true);
            }));
            coll.Add(nameof(JsGameAngular), new LibItem(c =>
            {
                c.NativeName = "game-angular";
                var lcoal = _concatDirFName(JS_P, c.NativeName);
                c._concat(lcoal, "", true);
            }));
            coll.Add(nameof(CssGame), new LibItem(c =>
            {
                c.NativeName = "game";
                var lcoal = _concatDirFName(CSS_P, c.NativeName);
                c._concat(lcoal, "", false);
            }));

            #endregion

            #endregion

            #region Angualr

            const string ANGULAR_VER = "1.6.6";
            const string angularJs = "angular.js";
            coll.Add(nameof(JsAngular), new LibItem("angular", ANGULAR_VER, c =>
            {
                //https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular.min.js

                c.FallbackTest = @"!!window.angular";
                c.Integrity = @"sha384-a/qc9YpJkfm3IzVxSf8MjtCLp0XDY38Ol7c17TK8dK595xeW5qIVH6CCq2ecK474";
  
                c.IntegrityMin = @"sha384-du5g06MyvN/hl4HwDjcFNmKiX3lFDaekrtlW37Bs3hY+FAKWFpVrZwlP/bh20AXW";
                var lcoal = _localPathAng(c.NativeName);
                var cdn = _getCdnCfPathAng(angularJs, c.NativeName, c.Version);
            
                c._concat(lcoal, cdn, true);
            }));
            const string angularMaterialVersion = "1.1.5";
            coll.Add(nameof(JsAngularMaterial), new LibItem("angular-material", angularMaterialVersion, c =>
            {
                c.FallbackTest = _checkAngularModule("ngMaterial");
                c.Integrity = @"sha384-2Y5yGVvFr4bobbqrITpqA90niuQZ0bkOMek4n+qduFi6ZX/UFK/QClQ/5iHhZ+eH";
                c.IntegrityMin = @"sha384-IHpLZ/AxsQPC2btsMW7zJuJeAiYnE9hk9clLR1tuuavuGgCnAeI3GZao4RPr0pta";
                var lcoal = _localPathAng(c.NativeName);
                var cdn = _getCdnCfPathAng(c.NativeName, c.Version);
                c._concat(lcoal, cdn, true);
            }));

            coll.Add(nameof(CssAngularMaterial), new LibItem("angular-material", angularMaterialVersion, c =>
            {
                //https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.1.5/angular-material.min.css

                c.FallbackTestClass = "md-visually-hidden";
                c.FallbackTestProperty = "margin";
                c.FallbackTestValue = "-1px";
                c.Integrity = @"sha384-GPUTu7xeunh9MLGLVM9I98wG6ojSDp0Mi2D3G41+5K+uZGNat44STnmASMGe/rRb";
                c.IntegrityMin = @"sha384-s0TShKDlqEJ582XnqaE/WBUH8K9kn0MOr6zn0bGBQaBxabiZMXTxAkSIwOeXVKKm";

                var lcoal = _localPathAng(c.NativeName);
                var cdn = _getCdnCfPathAng(c.NativeName, c.Version);
                c._concat(lcoal, cdn, false);
            }));
            coll.Add(nameof(JsAngularSantize), new LibItem("angular-sanitize", ANGULAR_VER, c =>
            {
                c.FallbackTest = _checkAngularModule("ngSanitize");
                c.Integrity = @"sha384-m+1T+Cey/6PN5f1smp+7oLVtqOu9uN97k4fDpNoIyBjYOGtxHnMSD2IxIA7dkWNo";
                c.IntegrityMin = @"sha384-GtfVsPo7UYakgT+aPaZNyp35zOQ57/Z4EssBXDFeQPYa/ZeyAGjL1mx4lJgI/fJ+";
                var lcoal = _localPathAng(c.NativeName);
                var cdn = _getCdnCfPathAng(c.NativeName, c.Version);

                c._concat(lcoal, cdn, true);
            }));
            // angular-animate  //angular.js
            coll.Add(nameof(JsAngularAnimation), new LibItem("angular-animate", ANGULAR_VER, c =>
            {
                c.FallbackTest = _checkAngularModule("ngAnimate");
                c.Integrity = @"sha384-J3ljVdT9FSz2hiX1lfsWk64JdMmFvg+MAJpsuMEuRp+Bnl8T5JYAOpkHMuZSpLwt";
                c.IntegrityMin = @"sha384-ZpuLwVwV1SmCOgyYliY05cquMsh54R08I7ILW0ElirX5M9xPK+isFv5blNiWuJdQ";
                var lcoal = _localPathAng(c.NativeName);
                var cdn = _getCdnCfPathAng(angularJs, c.NativeName, c.Version);
                c._concat(lcoal, cdn, true);
            }));

            coll.Add(nameof(JsAngularAria), new LibItem("angular-aria", ANGULAR_VER, c =>
            {
                c.FallbackTest = _checkAngularModule("ngAria");
                c.Integrity = @"sha384-lLkExtKkCqJ1Op9OHf/+t0zAMSmIPe1uZj0i5MOYGprsLe5hetSzQcF5BRKugQQd";
                c.IntegrityMin = @"sha384-Dp2awdtIfydRQF7W8sIvhYf6Q9z3skiMwvSaEbWQ/UujE5UCl4SauwBgW+IlwV1K";

                var lcoal = _localPathAng(c.NativeName);
                var cdn = _getCdnCfPathAng(angularJs, c.NativeName, c.Version);

                c._concat(lcoal, cdn, true);
            }));
            coll.Add(nameof(JsAngularMessages), new LibItem("angular-messages", ANGULAR_VER, c =>
            {
                c.FallbackTest = _checkAngularModule("ngMessages");
                c.Integrity = @"sha384-9EGgeHFZu0YmpQmuJgx35+AFBp7UVvSLGY9ZRQOGyYr/7INV4bCsKUBvr71mbfsW";
                c.IntegrityMin = @"sha384-Bbnf8TfryBI99HqDceYeUIbk1ht1FK/MJcJTWlw3pIRa2JdcWIwdJ/MPbR0JFxUo";

                var lcoal = _localPathAng(c.NativeName);
                var cdn = _getCdnCfPathAng(c.NativeName, c.Version);

                c._concat(lcoal, cdn, true);
            }));

            coll.Add(nameof(JsAngularSvgAssetCahce), new LibItem("svg-assets-cache", ANGULAR_VER, c =>
            {
                var lcoal = _concatDirFName(LIB, c.NativeName);
                c._concat(lcoal, "", true);
            }));

            #region File and image

            var lfNgInputVer = "1.5.3";
            //lf-ng-md-file-input
            coll.Add(nameof(JsAngularLfNgMdFileInput), new LibItem("lf-ng-md-file-input", lfNgInputVer, c =>
            {
                //https://cdn.jsdelivr.net/npm/lf-ng-md-file-input@1.5.3/dist/lf-ng-md-file-input.min.js
                c.FallbackTest = _checkAngularModule("lfNgMdFileInput");
                c.Integrity = @"sha384-PcqLk8E3krUEzBxCBGsFXSPF9D29hFfr72vYrEYSHyVfLvW/f9coJXGw+scp+im2";
                c.IntegrityMin = @"sha384-act0GbU/M4pM/VeSJqurx5CKOaylxxvp2tqHUl0923CRXJrQZhzt6fR67POdHOse";

                var local = $"{LIB}{c.NativeName}/dist/{c.NativeName}";
                var cdn = $@"{JSDELIVR}{c.NativeName}@{c.Version}/dist/{c.NativeName}";


                c._concat(local, cdn, true);
            }));

            coll.Add(nameof(CssAngularLfNgMdFileInput), new LibItem("lf-ng-md-file-input", lfNgInputVer, c =>
            {
                //https://cdn.jsdelivr.net/npm/lf-ng-md-file-input@1.5.3/dist/lf-ng-md-file-input.min.css
                c.FallbackTestClass = "";
                c.FallbackTestProperty = "";
                c.FallbackTestValue = "";
                c.Integrity = @"sha384-1eoirFwYCV/bNMTpnBwbIjGJdAXINIxD06iQvNkwza2VVlams2W1ZnVF/S/RL6Mv";
                c.IntegrityMin = @"sha384-QTRgbq/9UUT4D96Vem0fTjVKkMlR4Nx63zVJVa4zK/IZcDtKmK9EFpv1i94J4j9x";
                var local = $"{LIB}{c.NativeName}/dist/{c.NativeName}";
                var cdn = $@"{JSDELIVR}{c.NativeName}@{c.Version}/dist/{c.NativeName}";


                c._concat(local, cdn, false);
            }));


            //ngInfiniteScroll
            coll.Add(nameof(JsAngularNgInfiniteScroll), new LibItem("ng-infinite-scroll", "", c =>
            {
                c.FallbackTest = "";
                c.Integrity = @"";
                c.IntegrityMin = @"";
                var dir = $"{LIB}ngInfiniteScroll/build/";
                var lcoal = _concatDirFName(dir, c.NativeName);
                c._concat(lcoal, "", true);
            }));
            //angular-file-upload
            coll.Add(nameof(JsAngularFileUpload), new LibItem("angular-file-upload", "", c =>
            {
                c.FallbackTest = "";
                c.Integrity = @"";
                c.IntegrityMin = @"";
                c.CdnPath = $"";
                c.CdnPathMin = $"";
                var dir = $"{LIB}{c.NativeName}/dist/";
                var lcoal = _concatDirFName(dir, c.NativeName);
                c._concat(lcoal, "", true);
            }));

            //ng-file-upload
            coll.Add(nameof(JsAngularNgFileUpload), new LibItem("ng-file-upload", "12.2.13", c =>
            {
                //https://cdn.jsdelivr.net/npm/ng-file-upload@12.2.13/dist/ng-file-upload-all.js
                c.FallbackTest = _checkAngularModule("ngFileUpload");
                c.Integrity = @"sha384-IPrpgVyp5WNgVJuLfzVF6Qlfb8TUOZxsXy/JmkWdXtWTmUMxmSYH1cT7iXvrgI55";
                c.IntegrityMin = @"sha384-NbBOS/QuqJqwWOtYg/L3ZDhgl/6GFyvkRMypJQLgoisMPtJiHj5uQ+3bj8V8Muwm";

                var cdn = $"{JSDELIVR}{c.NativeName}@{c.Version}/dist/{c.NativeName}-all";
                var lcoal = _concatDirFName(LIB, c.NativeName);
                c._concat(lcoal, cdn, true);
            }));
            //ng-img-crop
            coll.Add(nameof(JsAngularNgImgCrop), new LibItem("ng-img-crop", "", c =>
            {
                var dir = $"{LIB + c.NativeName}/compile/";
                c.LocalPath = $"{dir}unminified/{c.NativeName}.js";
                c.LocalPathMin = $"{dir}minified/{c.NativeName}.js";
                c.FallbackTest = "";
                c.Integrity = @"";
                c.IntegrityMin = @"";
                c.CdnPath = $"";
                c.CdnPathMin = $"";
            }));
            //ui-cropper
            coll.Add(nameof(JsAngularUiCropper), new LibItem("ui-cropper", "", c =>
            {
                var dir = $"{LIB + c.NativeName}/compile/";
                c.LocalPath = $"{dir}unminified/{c.NativeName}.js";
                c.LocalPathMin = $"{dir}minified/{c.NativeName}.js";
                c.FallbackTest = "";
                c.Integrity = @"";
                c.IntegrityMin = @"";
                c.CdnPath = $"";
                c.CdnPathMin = $"";
            }));

            #endregion

            #endregion


            #region medium-editor

            const string mediumEditorVer = "5.23.2";
            const string meName = "medium-editor";
            coll.Add(nameof(JsMediumEditor), new LibItem(meName, mediumEditorVer, c =>
            {
                //https://cdn.jsdelivr.net/npm/medium-editor@5.23.2/dist/js/medium-editor.min.js
                c.FallbackTest = "!!MediumEditor.version";
                c.Integrity = @"sha384-UHkWyErjlKPf6b3RLxNnzabNEZ+hRyl4MUumVJzk91zpvLaEc7FP59Z4e2TUP2Pp";
                c.IntegrityMin = @"sha384-6nlL0rKyi47pM6BtEfZX2A5plzL5sR/7i6+eu9U/DDfXgtI+ubPCvv/j15jdjoaS";
                var local = _concatDirFName(LIB, c.NativeName);
                var cdn = $"{JSDELIVR}{c.NativeName}@{c.Version}/dist/js/{c.NativeName}";

                c._concat(local, cdn, true);
            }));

            coll.Add(nameof(CssMediumEditor), new LibItem(meName, mediumEditorVer, c =>
            {
                //https://cdn.jsdelivr.net/npm/medium-editor@5.23.2/dist/css/medium-editor.min.css
                c.FallbackTestClass = "medium-editor-toolbar";
                c.FallbackTestProperty = "z-index";
                c.FallbackTestValue = "2000";
                c.Integrity = @"sha384-gNiwz66InRaccEkEfCzdhoK+24vIKm9CXST7duCQQwYZl7srDrvBfs0LWf0TZs1K";
                c.IntegrityMin = @"sha384-CVTTH9nm9SfhN9tNCXRnqJJMO7ZGEqO9ga1MnPFLhzWClxM7b+Akmq6znFYKaM/i";
                var local = _concatDirFName(LIB, c.NativeName);
                var cdn = $"{JSDELIVR}{c.NativeName}@{c.Version}/dist/css/{c.NativeName}";

                c._concat(local, cdn, false);
            }));

            #endregion


            #region Other

            const string jqUiName = "jquery-ui";
            const string jqUiVer = "1.12.1";
            var jqUiCdnDir = $"{CLOUDFLARE}jqueryui/{jqUiVer}/";

            coll.Add(nameof(JsJqUi), new LibItem(jqUiName, jqUiVer, c =>
            {
                //https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js
                c.FallbackTest = "";
                c.Integrity = @"sha384-JPbtLYL10d/Z1crlc6GGGGM3PavCzzoUJ1UxH0bXHOfguWHQ6XAWrIzW+MBGGXe5";
                c.IntegrityMin = @"sha384-PtTRqvDhycIBU6x1wwIqnbDo8adeWIWP3AHmnrvccafo35E7oIvW7HPXn2YimvWu";
                var local = _concatDirFName(LIB + c.NativeName, c.NativeName);
                var cdn = jqUiCdnDir + c.NativeName;


                c._concat(local, cdn, true);
            }));


            coll.Add(nameof(CssJqUi), new LibItem(jqUiName, jqUiVer, c =>
            {
                //https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css
 
                c.FallbackTestClass = "ui-front";
                c.FallbackTestProperty = "z-index";
                c.FallbackTestValue = "100";
                c.Integrity = @"sha384-Nlo8b0yiGl7Dn+BgLn4mxhIIBU6We7aeeiulNCjHdUv/eKHx59s3anfSUjExbDxn";
                c.IntegrityMin = @"sha384-/qLewTwqEHLrVTnUlbu3ATiIUIu0EIi9BGAu6pmzyrvSbDzsDjFnnT13e+oX6hG0";

                var dir = LIB + $@"{c.NativeName}/themes/smoothness/";
                var local = _concatDirFName(dir, c.NativeName);
                var cdn = $"{jqUiCdnDir}themes/smoothness/{c.NativeName}";
                c._concat(local, cdn, false);
            }));


            //version 1.3.1
            coll.Add(nameof(JsJqEasing), new LibItem("jquery.easing", "1.3.1", c =>
            {
                //https://cdn.jsdelivr.net/npm/jquery.easing@1.4.1/jquery.easing.min.js
                c.FallbackTest = "!!jQuery.easing";
                c.Integrity = @"sha384-MM5zsVvrGlQFmN1sWfTOj9JjMl0Gq4xJ8s/nBc2iPfG/XwziF9SGiLpI/v+PIHfi";
                c.IntegrityMin = @"sha384-KeMwuwGHhNF2wLIf38PQm+1nL1+qPBFHOy/7+Igs7e/86qxAnmR2LAjN8/Xok5fc";

                var local = $"{LIB}{c.NativeName}/js/{c.NativeName}";
                var cdn = $"{JSDELIVR}{c.NativeName}@{c.Version}/{c.NativeName}.1.3";

                c._concat(local, cdn, true);
            }));


            const string select2Name = "select2";
            const string select2Ver = "4.0.4";
            coll.Add(nameof(JsSelect2), new LibItem(select2Name, select2Ver, c =>
            {
                //https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.4/js/select2.full.js

                c.FallbackTest = "!!$.fn.select2";
                c.Integrity = @"sha384-5hopBVwWqZ73OeeeQUZIXWWu+1uKMqXqwNZeKQyYfhXm9qi6hlBNW1dQj2mn6Pjz";
                c.IntegrityMin = @"sha384-QCYq0yFrcNuuqDsuD98T18FErKdcmARgCi3hH79zWY3Mov4KBzcnHGto0tersTm8";
                var local = _concatDirFName(LIB, c.NativeName);
                var cdn = $"{CLOUDFLARE}{c.NativeName}/{c.Version}/js/{c.NativeName}.full";


                c._concat(local, cdn, true);
            }));
            coll.Add(nameof(CssSelect2), new LibItem(select2Name, select2Ver, c =>
            {
                //https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.4/css/select2.css
                c.FallbackTestClass = "select2-dropdown";
                c.FallbackTestProperty = "left";
                c.FallbackTestValue = "-100000px";
                c.Integrity = @"sha384-OHaMD69K68r4bj0APiEytPiO1eVdmz4FnEoFybuscWT1XgaY9+y2PBykmYsADpQ2";
                c.IntegrityMin = @"sha384-HIipfSYbpCkh5/1V87AWAeR5SUrNiewznrUrtNz1ux4uneLhsAKzv/0FnMbj3m6g";

                var local = _concatDirFName(LIB, c.NativeName);
                var cdn = $"{CLOUDFLARE}{c.NativeName}/{c.Version}/css/{c.NativeName}";
                c._concat(local, cdn, false);
            }));

            #endregion

            #region Babylon

            coll.Add(nameof(JsBabylonCustom), new LibItem("babylon.custom", "", c =>
            {
                c.FallbackTest = "";
                c.Integrity = @"";
                c.IntegrityMin = @"";
                c.CdnPath = $"";
                c.CdnPathMin = $"";

                var local = _concatDirFName(LIB, c.NativeName);
                c._concat(local, "", true);
            }));
            
            coll.Add(nameof(JsBabylonInspector), new LibItem("babylon.inspector.bundle", "", c =>
            {
                c.FallbackTest = "";
                c.Integrity = @"";
                c.IntegrityMin = @"";
                c.CdnPath = $"";
                c.CdnPathMin = $"";
                var local = _concatDirFName(LIB, c.NativeName);
                c._concat(local, "", true);
            }));


            coll.Add(nameof(JsSignalr), new LibItem("signalr", "", c =>
            {
                c.FallbackTest = "";
                c.Integrity = @"";
                c.IntegrityMin = @"";
                c.CdnPath = $"";
                c.CdnPathMin = $"";
                var local = _concatDirFName(LIB, c.NativeName);
                c._concat(local, "", true);
            }));

            #endregion


            return new ReadOnlyDictionary<string, ILibItem>(coll);
        }


        #region void

        private static IReadOnlyDictionary<string, ILibItem> __collection;
        private static IReadOnlyDictionary<string, ILibItem> _collection => __collection ?? (__collection = _create());

        private static string _concat(string filePath, bool isJs, bool min)
        {
            var ext = ".";
            if (min)
            {
                ext += "min.";
            }
            ext+= isJs?"js":"css";
 
            return filePath + ext;
        }

        private static void _concat(this LibItem item, string localPath, string cdnPath, bool isJs)
        {
            item.LocalPath = _concat(localPath, isJs, false);
            item.LocalPathMin = _concat(localPath, isJs, true);
            
            item.CdnPath = _concat(cdnPath, isJs, false);
            item.CdnPathMin = _concat(cdnPath, isJs, true);
        }

        private static string _concatDirFName(string dir, string fileName)
        {
            if (!dir.EndsWith("/"))
            {
                dir += "/";
            }
            return dir + fileName;
        }

        private static string _localPathAng(string moduleName)
        {
            var dir = LIB + moduleName + "/";
            return dir + moduleName;
        }

        private static string _getCdnCfPathAng(string moduleName, string version) =>
            _getCdnCfPathAng(moduleName, moduleName, version);

        private static string _getCdnCfPathAng(string moduleName, string fileName, string version) =>$@"{CLOUDFLARE}{moduleName}/{version}/{fileName}";

        private static string _checkAngularModule(string moduleName) =>
            @"(function () {try {window.angular.module('"+moduleName+"');} catch (e) {return false;}return true;})()";

        #endregion


        #region Property

        public static ILibItem JsModernizr => _collection[nameof(JsModernizr)];
        public static ILibItem JsJquery => _collection[nameof(JsJquery)];
        public static ILibItem JsJqCookie => _collection[nameof(JsJqCookie)];
        public static ILibItem JsLodash => _collection[nameof(JsLodash)];
        public static ILibItem JsJqValidate => _collection[nameof(JsJqValidate)];
        public static ILibItem JsJqValidateUnobtrusive => _collection[nameof(JsJqValidateUnobtrusive)];
        public static ILibItem JsBootstrapFull => _collection[nameof(JsBootstrapFull)];
        public static ILibItem CssBootstrapFull => _collection[nameof(CssBootstrapFull)];
        public static ILibItem CssFontAwesome => _collection[nameof(CssFontAwesome)];
        public static ILibItem JsMalihuCsp => _collection[nameof(JsMalihuCsp)];
        public static ILibItem CssMalihuCsp => _collection[nameof(CssMalihuCsp)];
        public static ILibItem JsThirdParty => _collection[nameof(JsThirdParty)];

        #region My 

        //util, and other
        public static ILibItem JsCommon => _collection[nameof(JsCommon)];

        //site js
        public static ILibItem JsSite => _collection[nameof(JsSite)];

        //site css
        public static ILibItem CssSite => _collection[nameof(CssSite)];

        //site js angular
        public static ILibItem JsSiteAngular => _collection[nameof(JsSiteAngular)];

        //site admin
        public static ILibItem JsAdminAngularCore => _collection[nameof(JsAdminAngularCore)];

        public static ILibItem JsAdminAngularInitialize => _collection[nameof(JsAdminAngularInitialize)];
        public static ILibItem JsAdminAngularSpace => _collection[nameof(JsAdminAngularSpace)];
        public static ILibItem JsAdminAngularStore => _collection[nameof(JsAdminAngularStore)];


        //game
        public static ILibItem JsGameAngular => _collection[nameof(JsGameAngular)];

        public static ILibItem JsGame => _collection[nameof(JsGame)];
        public static ILibItem CssGame => _collection[nameof(CssGame)];

        #endregion

        #region Angular

        public static ILibItem JsAngular => _collection[nameof(JsAngular)];

        //AngularMaterial
        public static ILibItem JsAngularMaterial => _collection[nameof(JsAngularMaterial)];

        public static ILibItem CssAngularMaterial => _collection[nameof(CssAngularMaterial)];

        public static ILibItem JsAngularSantize => _collection[nameof(JsAngularSantize)];
        public static ILibItem JsAngularAnimation => _collection[nameof(JsAngularAnimation)];
        public static ILibItem JsAngularAria => _collection[nameof(JsAngularAria)];
        public static ILibItem JsAngularMessages => _collection[nameof(JsAngularMessages)];
        public static ILibItem JsAngularSvgAssetCahce => _collection[nameof(JsAngularSvgAssetCahce)];

        #region lf-ng-md-file-input

        public static ILibItem JsAngularLfNgMdFileInput => _collection[nameof(JsAngularLfNgMdFileInput)];
        public static ILibItem CssAngularLfNgMdFileInput => _collection[nameof(JsAngularLfNgMdFileInput)];

        #endregion


        public static ILibItem JsAngularNgInfiniteScroll => _collection[nameof(JsAngularNgInfiniteScroll)];
        public static ILibItem JsAngularFileUpload => _collection[nameof(JsAngularFileUpload)];
        public static ILibItem JsAngularNgFileUpload => _collection[nameof(JsAngularNgFileUpload)];
        public static ILibItem JsAngularNgImgCrop => _collection[nameof(JsAngularNgImgCrop)];
        public static ILibItem JsAngularUiCropper => _collection[nameof(JsAngularUiCropper)];

        #endregion

        #region medium-editor

        public static ILibItem JsMediumEditor => _collection[nameof(JsMediumEditor)];
        public static ILibItem CssMediumEditor => _collection[nameof(CssMediumEditor)];

        #endregion


        #region Other

        public static ILibItem JsJqUi => _collection[nameof(JsJqUi)];
        public static ILibItem CssJqUi => _collection[nameof(CssJqUi)];

        public static ILibItem JsJqEasing => _collection[nameof(JsJqEasing)];
        public static ILibItem JsSelect2 => _collection[nameof(JsSelect2)];
        public static ILibItem CssSelect2 => _collection[nameof(CssSelect2)];
        public static ILibItem JsSignalr => _collection[nameof(JsSignalr)];

        #endregion

        #region Babylon

        public static ILibItem JsBabylonCustom => _collection[nameof(JsBabylonCustom)];
        public static ILibItem JsBabylonInspector => _collection[nameof(JsBabylonInspector)];

        #endregion

        #endregion
    }
}
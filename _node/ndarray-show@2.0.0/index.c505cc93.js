import*as d from"../fixed-width-float@1.0.0/index.dcf92e41.js";import*as h from"../ndarray@1.0.19/index.2ea96455.js";function c(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function l(t){return t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var m=l(d),v=l(h),j=m,_=v,w=function(t,r){if(r||(r={}),typeof r=="number"&&(r={width:r}),r.width||(r.width=8),t.dimension===void 0&&(t=_(t)),t.dimension===1)return f(t,r);if(t.dimension===2)return p(t,r);if(t.dimension===3)return s(t,r);if(t.dimension===4)return y(t,r)};function f(t,r){for(var n=[],e=0;e<t.shape[0];e++)n.push(j(t.get(e),r.width));return n.join(" ")}function p(t,r){for(var n=[],e=0;e<t.shape[0];e++)n.push(f(t.pick(e,null),r));return n.join(`
`)}function s(t,r){for(var n=[],e=0;e<t.shape[0];e++)n.push(p(t.pick(e,null,null),r),"");return n.join(`
`)}function y(t,r){for(var n=[],e=3,o=0;o<t.shape[0];o++){var i=s(t.pick(o,null,null,null),r);n.push(i);for(var u=i.split(`
`),a=0;a<u.length;a++)e=Math.max(e,u[a].length)}return n.join(`
`+Array(e+1).join("-")+`

`)}var g=c(w);export{g as default};

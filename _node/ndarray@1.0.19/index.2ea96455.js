import*as g from"../iota-array@1.0.0/index.90f1ef0f.js";import*as _ from"../is-buffer@1.1.6/index.b42ddc39.js";function w(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}function j(n){return n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var A=j(g),O=j(_),F=A,M=O,I=typeof Float64Array<"u";function R(n,i){return n[0]-i[0]}function T(){var n=this.stride,i=new Array(n.length),t;for(t=0;t<i.length;++t)i[t]=[Math.abs(n[t]),t];i.sort(R);var s=new Array(i.length);for(t=0;t<s.length;++t)s[t]=i[t][1];return s}function k(n,i){var t=["View",i,"d",n].join("");i<0&&(t="View_Nil"+n);var s=n==="generic";if(i===-1){var e="function "+t+"(a){this.data=a;};var proto="+t+".prototype;proto.dtype='"+n+"';proto.index=function(){return -1};proto.size=0;proto.dimension=-1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function(){return new "+t+"(this.data);};proto.get=proto.set=function(){};proto.pick=function(){return null};return function construct_"+t+"(a){return new "+t+"(a);}",h=new Function(e);return h()}else if(i===0){var e="function "+t+"(a,d) {this.data = a;this.offset = d};var proto="+t+".prototype;proto.dtype='"+n+"';proto.index=function(){return this.offset};proto.dimension=0;proto.size=1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function "+t+"_copy() {return new "+t+"(this.data,this.offset)};proto.pick=function "+t+"_pick(){return TrivialArray(this.data);};proto.valueOf=proto.get=function "+t+"_get(){return "+(s?"this.data.get(this.offset)":"this.data[this.offset]")+"};proto.set=function "+t+"_set(v){return "+(s?"this.data.set(this.offset,v)":"this.data[this.offset]=v")+"};return function construct_"+t+"(a,b,c,d){return new "+t+"(a,d)}",h=new Function("TrivialArray",e);return h(d[n][0])}var e=["'use strict'"],a=F(i),u=a.map(function(r){return"i"+r}),p="this.offset+"+a.map(function(r){return"this.stride["+r+"]*i"+r}).join("+"),f=a.map(function(r){return"b"+r}).join(","),c=a.map(function(r){return"c"+r}).join(",");e.push("function "+t+"(a,"+f+","+c+",d){this.data=a","this.shape=["+f+"]","this.stride=["+c+"]","this.offset=d|0}","var proto="+t+".prototype","proto.dtype='"+n+"'","proto.dimension="+i),e.push("Object.defineProperty(proto,'size',{get:function "+t+"_size(){return "+a.map(function(r){return"this.shape["+r+"]"}).join("*"),"}})"),i===1?e.push("proto.order=[0]"):(e.push("Object.defineProperty(proto,'order',{get:"),i<4?(e.push("function "+t+"_order(){"),i===2?e.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})"):i===3&&e.push("var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);if(s0>s1){if(s1>s2){return [2,1,0];}else if(s0>s2){return [1,2,0];}else{return [1,0,2];}}else if(s0>s2){return [2,0,1];}else if(s2>s1){return [0,1,2];}else{return [0,2,1];}}})")):e.push("ORDER})")),e.push("proto.set=function "+t+"_set("+u.join(",")+",v){"),s?e.push("return this.data.set("+p+",v)}"):e.push("return this.data["+p+"]=v}"),e.push("proto.get=function "+t+"_get("+u.join(",")+"){"),s?e.push("return this.data.get("+p+")}"):e.push("return this.data["+p+"]}"),e.push("proto.index=function "+t+"_index(",u.join(),"){return "+p+"}"),e.push("proto.hi=function "+t+"_hi("+u.join(",")+"){return new "+t+"(this.data,"+a.map(function(r){return["(typeof i",r,"!=='number'||i",r,"<0)?this.shape[",r,"]:i",r,"|0"].join("")}).join(",")+","+a.map(function(r){return"this.stride["+r+"]"}).join(",")+",this.offset)}");var y=a.map(function(r){return"a"+r+"=this.shape["+r+"]"}),v=a.map(function(r){return"c"+r+"=this.stride["+r+"]"});e.push("proto.lo=function "+t+"_lo("+u.join(",")+"){var b=this.offset,d=0,"+y.join(",")+","+v.join(","));for(var o=0;o<i;++o)e.push("if(typeof i"+o+"==='number'&&i"+o+">=0){d=i"+o+"|0;b+=c"+o+"*d;a"+o+"-=d}");e.push("return new "+t+"(this.data,"+a.map(function(r){return"a"+r}).join(",")+","+a.map(function(r){return"c"+r}).join(",")+",b)}"),e.push("proto.step=function "+t+"_step("+u.join(",")+"){var "+a.map(function(r){return"a"+r+"=this.shape["+r+"]"}).join(",")+","+a.map(function(r){return"b"+r+"=this.stride["+r+"]"}).join(",")+",c=this.offset,d=0,ceil=Math.ceil");for(var o=0;o<i;++o)e.push("if(typeof i"+o+"==='number'){d=i"+o+"|0;if(d<0){c+=b"+o+"*(a"+o+"-1);a"+o+"=ceil(-a"+o+"/d)}else{a"+o+"=ceil(a"+o+"/d)}b"+o+"*=d}");e.push("return new "+t+"(this.data,"+a.map(function(r){return"a"+r}).join(",")+","+a.map(function(r){return"b"+r}).join(",")+",c)}");for(var l=new Array(i),b=new Array(i),o=0;o<i;++o)l[o]="a[i"+o+"]",b[o]="b[i"+o+"]";e.push("proto.transpose=function "+t+"_transpose("+u+"){"+u.map(function(r,m){return r+"=("+r+"===undefined?"+m+":"+r+"|0)"}).join(";"),"var a=this.shape,b=this.stride;return new "+t+"(this.data,"+l.join(",")+","+b.join(",")+",this.offset)}"),e.push("proto.pick=function "+t+"_pick("+u+"){var a=[],b=[],c=this.offset");for(var o=0;o<i;++o)e.push("if(typeof i"+o+"==='number'&&i"+o+">=0){c=(c+this.stride["+o+"]*i"+o+")|0}else{a.push(this.shape["+o+"]);b.push(this.stride["+o+"])}");e.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}"),e.push("return function construct_"+t+"(data,shape,stride,offset){return new "+t+"(data,"+a.map(function(r){return"shape["+r+"]"}).join(",")+","+a.map(function(r){return"stride["+r+"]"}).join(",")+",offset)}");var h=new Function("CTOR_LIST","ORDER",e.join(`
`));return h(d[n],T)}function C(n){if(M(n))return"buffer";if(I)switch(Object.prototype.toString.call(n)){case"[object Float64Array]":return"float64";case"[object Float32Array]":return"float32";case"[object Int8Array]":return"int8";case"[object Int16Array]":return"int16";case"[object Int32Array]":return"int32";case"[object Uint8Array]":return"uint8";case"[object Uint16Array]":return"uint16";case"[object Uint32Array]":return"uint32";case"[object Uint8ClampedArray]":return"uint8_clamped";case"[object BigInt64Array]":return"bigint64";case"[object BigUint64Array]":return"biguint64"}return Array.isArray(n)?"array":"generic"}var d={float32:[],float64:[],int8:[],int16:[],int32:[],uint8:[],uint16:[],uint32:[],array:[],uint8_clamped:[],bigint64:[],biguint64:[],buffer:[],generic:[]};function P(n,i,t,s){if(n===void 0){var c=d.array[0];return c([])}else typeof n=="number"&&(n=[n]);i===void 0&&(i=[n.length]);var e=i.length;if(t===void 0){t=new Array(e);for(var a=e-1,u=1;a>=0;--a)t[a]=u,u*=i[a]}if(s===void 0){s=0;for(var a=0;a<e;++a)t[a]<0&&(s-=(i[a]-1)*t[a])}for(var p=C(n),f=d[p];f.length<=e+1;)f.push(k(p,f.length-1));var c=f[e+1];return c(n,i,t,s)}var U=P,x=w(U);export{x as default};
